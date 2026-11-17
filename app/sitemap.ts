import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const [products,categories,articles] = await Promise.all([prisma.product.findMany({where:{isActive:true},select:{slug:true,updatedAt:true}}),prisma.category.findMany({where:{isActive:true},select:{slug:true}}),prisma.article.findMany({where:{isPublished:true},select:{slug:true,createdAt:true}})]);
  return ["","shop","about","contact","blog","faq"].map(path=>({url:`${base}/${path}`,lastModified:new Date()})).concat(categories.map(c=>({url:`${base}/category/${c.slug}`,lastModified:new Date()})),products.map(p=>({url:`${base}/product/${p.slug}`,lastModified:p.updatedAt})),articles.map(a=>({url:`${base}/blog/${a.slug}`,lastModified:a.createdAt})));
}
