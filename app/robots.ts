import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ramadan-habits.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sign-in", "/sign-up", "/dashboard", "/habits", "/progress", "/friends", "/challenges", "/profile"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
