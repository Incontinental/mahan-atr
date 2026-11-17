"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function FloatingActions() {
  const [chatOpen,setChatOpen] = useState(false); const [showTop,setShowTop] = useState(false); const pathname=usePathname();
  useEffect(()=>{ const onScroll=()=>setShowTop(window.scrollY>320); window.addEventListener("scroll",onScroll,{passive:true}); onScroll(); return ()=>window.removeEventListener("scroll",onScroll); },[]);
  if (pathname.startsWith("/admin")) return null;
  return <div className="floating-actions">
    {chatOpen && <div className="chat-popover"><button className="chat-close" onClick={()=>setChatOpen(false)} aria-label="بستن">×</button><b>سلام، به ماهان عطر خوش آمدید</b><p>برای پرسش درباره محصولات، ثبت سفارش یا پیگیری خرید، از راه ارتباطی فروشگاه استفاده کنید.</p><Link href="/contact" onClick={()=>setChatOpen(false)} className="chat-contact-link">ارتباط با فروشگاه</Link></div>}
    <button className="chat-launch" onClick={()=>setChatOpen(v=>!v)} aria-label={chatOpen?"بستن گفت‌وگو":"گفت‌وگو با ماهان عطر"}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5c-7.2 0-13 5.2-13 11.7 0 3.2 1.4 6.1 3.7 8.2L5.5 29l6.1-2.6c1.4.4 2.9.6 4.4.6 7.2 0 13-5.2 13-11.7S23.2 3.5 16 3.5Z"/><circle cx="11" cy="15.5" r="1.5"/><circle cx="16" cy="15.5" r="1.5"/><circle cx="21" cy="15.5" r="1.5"/></svg></button>
    <button className={`back-to-top ${showTop?"visible":""}`} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="بازگشت به بالای صفحه">⌃</button>
  </div>;
}
