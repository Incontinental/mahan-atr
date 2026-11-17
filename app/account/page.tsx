import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toman } from "@/lib/format";
import AccountForms from "@/components/AccountForms";
import LogoutButton from "@/components/LogoutButton";
export const dynamic="force-dynamic";
export default async function AccountPage(){const session=await getSession();const orders=session?await prisma.order.findMany({where:{userId:session.id},orderBy:{createdAt:"desc"},take:10}):[];return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / حساب کاربری</div><h1>حساب کاربری</h1><p>مدیریت سفارش‌ها و اطلاعات حساب شما.</p></div></div><section className="content-section"><div className="container">{session?<div className="form-card"><h2 style={{color:"var(--green)"}}>خوش آمدید، {session.name}</h2><p>نقش حساب: {session.role==="CUSTOMER"?"مشتری":"مدیر فروشگاه"}</p>{session.role!=="CUSTOMER"&&<Link className="btn btn-dark" href="/admin">ورود به پنل مدیریت</Link>}<h3 style={{marginTop:30}}>سفارش‌های اخیر</h3>{orders.length?<table className="cart-table"><thead><tr><th>شماره سفارش</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{toman(o.total)}</td><td>{o.status}</td></tr>)}</tbody></table>:<p>هنوز سفارشی در حساب شما ثبت نشده است.</p>}<div style={{marginTop:20}}><LogoutButton/></div></div>:<AccountForms/>}</div></section></>}
