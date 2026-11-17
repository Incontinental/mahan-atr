import {redirect} from "next/navigation";
import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductTable from "@/components/AdminProductTable";
export const dynamic="force-dynamic";
export default async function AdminProducts(){const admin=await requireAdmin();if(!admin)redirect("/admin/login");const [products,categories]=await Promise.all([prisma.product.findMany({include:{category:true},orderBy:{createdAt:"desc"},take:100}),prisma.category.findMany({where:{isActive:true},orderBy:{sortOrder:"asc"}})]);return <AdminShell active="products" title="مدیریت محصولات"><div className="admin-panel"><h2>افزودن محصول جدید</h2><AdminProductForm categories={categories}/></div><div className="admin-panel"><h2>فهرست محصولات ({products.length})</h2><AdminProductTable products={products}/></div></AdminShell>}
