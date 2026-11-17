import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
export async function POST(request: Request) {
  const parsed = z.object({ phone:z.string().min(10).max(15), password:z.string().min(8).max(100) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error:"شماره تلفن یا رمز عبور معتبر نیست." },{status:400});
  const user = await prisma.user.findUnique({ where:{ phone:parsed.data.phone } });
  if (!user || user.isBlocked || !(await bcrypt.compare(parsed.data.password,user.passwordHash))) return NextResponse.json({ error:"اطلاعات ورود صحیح نیست." },{status:401});
  await createSession({ id:user.id, role:user.role, name:user.name });
  return NextResponse.json({ success:true, role:user.role });
}
