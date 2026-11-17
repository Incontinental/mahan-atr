import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
export async function PATCH(request: Request) {
  const admin = await requireAdmin(); if (!admin || !["SUPER_ADMIN","STORE_MANAGER","ORDER_OPERATOR"].includes(admin.role)) return NextResponse.json({error:"دسترسی غیرمجاز"},{status:403});
  const parsed = z.object({ id:z.string(), status:z.enum(["PENDING_PAYMENT","PREPARING","HANDED_TO_CARRIER","SHIPPED","DELIVERED","CANCELLED"]),trackingCode:z.string().max(80).optional() }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error:"درخواست معتبر نیست."},{status:400});
  const order = await prisma.$transaction(async tx => {
    const previous = await tx.order.findUniqueOrThrow({ where: { id: parsed.data.id }, include: { items: true } });
    if (previous.status === "CANCELLED" && parsed.data.status !== "CANCELLED") throw new Error("سفارش لغوشده قابل فعال‌سازی مجدد نیست.");
    const updated = await tx.order.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status, ...(parsed.data.trackingCode !== undefined ? { trackingCode: parsed.data.trackingCode } : {}) } });
    if (parsed.data.status === "CANCELLED" && previous.status !== "CANCELLED") {
      for (const item of previous.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
    return updated;
  });
  return NextResponse.json({order});
}
