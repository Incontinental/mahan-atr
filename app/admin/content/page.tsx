import {redirect} from "next/navigation";
import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import AdminSettingsForm from "@/components/AdminSettingsForm";
export const dynamic="force-dynamic";
export default async function AdminContent(){const admin=await requireAdmin();if(!admin)redirect("/admin/login");const settings=await prisma.setting.findMany();const initial=Object.fromEntries(settings.map(x=>[x.key,x.value]));return <AdminShell active="content" title="تنظیمات محتوا و فروشگاه"><div className="admin-panel"><h2>اطلاعات اصلی فروشگاه</h2><p>اطلاعات واقعی را وارد کنید. فیلدهای خالی به‌صورت پیش‌فرض در سایت نمایش داده نمی‌شوند.</p><AdminSettingsForm initial={initial}/></div><div className="admin-panel"><h2>نکته امنیتی</h2><p>کلیدهای درگاه پرداخت، رمزها و اطلاعات محرمانه در این فرم ثبت نمی‌شوند. آن‌ها باید فقط از متغیرهای محیطی سرور تنظیم شوند.</p></div></AdminShell>}
