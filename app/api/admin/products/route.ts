import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { safeSlug } from "@/lib/format";
const schema = z.object({ name:z.string().min(2),slug:z.string().optional(),categoryId:z.string().min(1),price:z.number().int().min(0),salePrice:z.number().int().min(0).nullable().optional(),stock:z.number().int().min(0),unit:z.string().min(1),image:z.string().url().or(z.literal("")),excerpt:z.string().optional(),description:z.string().optional(),isActive:z.boolean().optional() });
export async function POST(request: Request) {
  const admin = await requireAdmin(); if (!admin || !["SUPER_ADMIN","STORE_MANAGER"].includes(admin.role)) return NextResponse.json({error:"دسترسی غیرمجاز"},{status:403});
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({error:"اطلاعات محصول معتبر نیست."},{status:400});
  const d = parsed.data; const slug = safeSlug(d.slug || d.name) || `product-${Date.now()}`;
  const product = await prisma.product.create({data:{name:d.name,slug,categoryId:d.categoryId,price:d.price,salePrice:d.salePrice,stock:d.stock,unit:d.unit,image:d.image || "/herb-placeholder.svg",excerpt:d.excerpt || "",description:d.description || "",isActive:d.isActive ?? true}});
  return NextResponse.json({product},{status:201});
}
