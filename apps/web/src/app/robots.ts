import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://credex-app-six.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/results/", "/audit/"],
        disallow: ["/dashboard", "/audits", "/integrations", "/settings", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
