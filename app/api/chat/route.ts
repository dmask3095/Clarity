import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

const DAILY_LIMIT = 50;
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatRequestBody {
  messages: MessageParam[];
  systemPrompt: string;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Missing ANTHROPIC_API_KEY on the server." },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabase
    .from("usage")
    .select("message_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const currentCount = usage?.message_count ?? 0;

  if (currentCount >= DAILY_LIMIT) {
    return Response.json(
      {
        error: "daily_limit",
        message:
          "You’ve reached today’s message limit. Come back tomorrow if you want to keep going.",
      },
      { status: 429 },
    );
  }

  const body = (await request.json()) as ChatRequestBody;

  if (!Array.isArray(body.messages) || typeof body.systemPrompt !== "string") {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await anthropic.messages.stream({
          model: MODEL,
          max_tokens: 600,
          system: body.systemPrompt,
          messages: body.messages,
        });

        for await (const chunk of anthropicStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`),
            );
          }
        }

        await supabase.from("usage").upsert(
          {
            user_id: user.id,
            date: today,
            message_count: currentCount + 1,
          },
          { onConflict: "user_id,date" },
        );

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "The stream stopped unexpectedly.";

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
