import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EptSsc · SSC CGL preparation",
    short_name: "EptSsc",
    description: "Real SSC CGL PYQs, speed drills, flashcards and word games.",
    start_url: "/practice",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f6fb",
    theme_color: "#4f46e5",
    categories: ["education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Practice Hub", url: "/practice", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Speed Maths", url: "/SSC/maths/mental-maths", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Formulas & Tricks", url: "/SSC/maths/formula-practice", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
