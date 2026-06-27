import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clarity",
    short_name: "Clarity",
    description: "A calm AI companion for grounding, focus, and emotional clarity.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0F14",
    theme_color: "#0F0F14",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
