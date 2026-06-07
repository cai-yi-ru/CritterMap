import type { MetadataRoute } from "next";
import { getAllPosts, getPostModifiedDate } from "@/lib/blog";
import { getHospitals } from "@/lib/getHospitals";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, hospitals] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getHospitals(),
  ]);
  const latestHospitalCheck = hospitals
    .map((hospital) => hospital.updatedAt || hospital.last_checked || hospital.google?.verifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestHospitalCheck ? new Date(latestHospitalCheck) : new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: posts[0] ? new Date(getPostModifiedDate(posts[0])) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(getPostModifiedDate(post)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
