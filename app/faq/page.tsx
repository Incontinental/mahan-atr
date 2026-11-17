import Link from "next/link";
import { faqFallbacks } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
export const dynamic="force-dynamic";
export default async function FaqPage(){const setting=await prisma.setting.findUnique({where:{key:"faq_items"}});let faqs:any[]=faqFallbacks;try{if(setting?.value)faqs=JSON.parse(setting.value)}catch{}return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / سوالات متداول</div><h1>سوالات متداول</h1><p>پاسخ چند پرسش رایج درباره خرید از ماهان عطر.</p></div></div><section className="content-section"><div className="container" style={{maxWidth:850}}>{faqs.map((x:any,i)=><article className="faq-item" key={i}><h3>{x[0]||x.question}</h3><p>{x[1]||x.answer}</p></article>)}</div></section></>}
