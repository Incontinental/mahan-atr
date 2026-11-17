import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); const q = searchParams.get("q")?.trim(); const slug = searchParams.get("category");
  const products = await prisma.product.findMany({ where: { isActive: true, ...(q ? { name: { contains: q } } : {}), ...(slug ? { category: { slug } } : {}) }, orderBy: { createdAt: "desc" }, take: 30, select: { id:true,name:true,slug:true,price:true,salePrice:true,stock:true,image:true,unit:true,excerpt:true } });
  return NextResponse.json({ products });
}
