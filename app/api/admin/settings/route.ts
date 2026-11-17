import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireAdmin} from "@/lib/auth";
import {z} from "zod";
const allowed=["store_phone","store_mobile","store_address","store_hours","instagram","telegram","about_title","about_text","shipping_flat","shipping_method","hero_title","hero_subtitle","footer_text","faq_items"];
export async function PATCH(request:Request){const admin=await requireAdmin();if(!admin||admin.role!=="SUPER_ADMIN")return NextResponse.json({error:"فقط مدیر کل اجازه تغییر تنظیمات را دارد."},{status:403});const parsed=z.record(z.string(),z.string().max(2000)).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"تنظیمات معتبر نیست."},{status:400});for(const [key,value] of Object.entries(parsed.data)){if(!allowed.includes(key))continue;await prisma.setting.upsert({where:{key},update:{value},create:{key,value}})}return NextResponse.json({success:true})}
