import type { MetadataRoute } from "next";

const SITE_URL = "https://www.realproprealty.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/dashboard/", "/login", "/signup", "/manager/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}