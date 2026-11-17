import {redirect} from "next/navigation";
import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import AdminOrderTable from "@/components/AdminOrderTable";
export const dynamic="force-dynamic";
export default async function AdminOrders(){const admin=await requireAdmin();if(!admin)redirect("/admin/login");const orders=await prisma.order.findMany({orderBy:{createdAt:"desc"},take:150});return <AdminShell active="orders" title="مدیریت سفارش‌ها"><div className="admin-panel"><h2>سفارش‌های ثبت‌شده</h2>{orders.length?<AdminOrderTable orders={orders}/>:<p>هنوز سفارشی ثبت نشده است.</p>}</div></AdminShell>}
