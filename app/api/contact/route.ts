import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
export async function POST(request: Request) {
  const parsed = z.object({ name:z.string().min(2).max(80),phone:z.string().min(10).max(15),subject:z.string().min(2).max(120),message:z.string().min(8).max(2000) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error:"لطفاً همه فیلدها را درست تکمیل کنید." },{status:400});
  await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ success:true, message:"پیام شما ثبت شد. پس از تکمیل اطلاعات تماس، فروشگاه می‌تواند پاسخ دهد." },{status:201});
}
