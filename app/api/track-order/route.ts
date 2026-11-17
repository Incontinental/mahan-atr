import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
export async function POST(request: Request) {
  const parsed = z.object({ orderNumber: z.string().min(4).max(40), phone: z.string().min(10).max(15) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "شماره سفارش و تلفن را درست وارد کنید." }, { status: 400 });
  const order = await prisma.order.findFirst({ where: { orderNumber: parsed.data.orderNumber, phone: parsed.data.phone }, select: { orderNumber:true,status:true,paymentStatus:true,trackingCode:true,createdAt:true,total:true } });
  if (!order) return NextResponse.json({ error: "سفارشی با این مشخصات پیدا نشد." }, { status: 404 });
  return NextResponse.json({ order });
}
