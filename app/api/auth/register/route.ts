import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
export async function POST(request: Request) {
  const parsed = z.object({ name:z.string().min(2).max(80),phone:z.string().min(10).max(15),password:z.string().min(8).max(100) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error:"نام، تلفن و رمز عبور معتبر وارد کنید. رمز باید دست‌کم ۸ نویسه باشد." },{status:400});
  if (await prisma.user.findUnique({ where:{phone:parsed.data.phone} })) return NextResponse.json({error:"این شماره تلفن قبلاً ثبت شده است."},{status:409});
  const user = await prisma.user.create({ data:{ name:parsed.data.name,phone:parsed.data.phone,passwordHash:await bcrypt.hash(parsed.data.password,12) } });
  await createSession({id:user.id,role:user.role,name:user.name});
  return NextResponse.json({success:true},{status:201});
}
