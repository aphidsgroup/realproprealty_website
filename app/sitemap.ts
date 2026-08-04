import type { MetadataRoute } from "next";

const SITE_URL = "https://www.realproprealty.com";

const PUBLIC_ROUTES = ["", "/list"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    return PUBLIC_ROUTES.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "daily",
        priority: route === "" ? 1 : 0.8,
    }));
}