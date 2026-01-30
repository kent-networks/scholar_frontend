import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Served at /robots.txt. Points crawlers to /sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
