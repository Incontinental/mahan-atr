import Link from "next/link";
import TrackOrderForm from "@/components/TrackOrderForm";
export default async function TrackOrderPage({searchParams}:{searchParams:Promise<{order?:string}>}){const params=await searchParams;return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / پیگیری سفارش</div><h1>پیگیری سفارش</h1><p>شماره سفارش و تلفن همراه ثبت‌شده را وارد کنید.</p></div></div><section className="content-section"><div className="container"><TrackOrderForm initialOrderNumber={params.order||""}/></div></section></>}
