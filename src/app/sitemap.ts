import type { MetadataRoute } from "next";
import { getAllPosts, getPostModifiedDate } from "@/lib/blog";
import { getHospitals } from "@/lib/getHospitals";
import { absoluteUrl, latestDate } from "@/lib/seo";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, hospitals] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getHospitals(),
  ]);
  const latestHospitalCheck = latestDate(hospitals.flatMap((hospital) => [
    hospital.updatedAt, hospital.last_checked, hospital.google?.verifiedAt,
  ]));
  const latestPostUpdate = latestDate(posts.map(getPostModifiedDate));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestHospitalCheck,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPostUpdate,
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
