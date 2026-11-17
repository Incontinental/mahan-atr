import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function CheckoutPage(){const settings=await prisma.setting.findMany({where:{key:{in:["shipping_flat","minimum_order"]}}});const values=Object.fromEntries(settings.map(x=>[x.key,x.value]));const shippingFlat=Math.max(0,Number(values.shipping_flat||0));const minimumOrder=Math.max(0,Number(values.minimum_order||0));return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / <Link href="/cart">سبد خرید</Link> / تکمیل سفارش</div><h1>تکمیل سفارش</h1><p>اطلاعات ارسال را با دقت وارد کنید.</p></div></div><section className="content-section"><div className="container"><CheckoutForm shippingFlat={shippingFlat} minimumOrder={minimumOrder}/></div></section></>}
