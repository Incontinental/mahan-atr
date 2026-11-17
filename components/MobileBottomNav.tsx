"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
const links = [
  { href: "/shop", label: "فروشگاه", icon: "store" },
  { href: "/cart", label: "سبد خرید", icon: "cart" },
  { href: "/account", label: "حساب کاربری", icon: "user" }
];
function Icon({ name }: { name: string }) {
  if (name === "user") return <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.5"/><path d="M4.5 21c.5-4.1 3.2-6.3 7.5-6.3s7 2.2 7.5 6.3"/></svg>;
  if (name === "cart") return <svg viewBox="0 0 24 24"><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>;
  if (name === "store") return <svg viewBox="0 0 24 24"><path d="M3 10.5 5 4h14l2 6.5M4 10v10h16V10M3 10c0 2 3 2.5 4.5 0 1.5 2.5 4.5 2.5 6 0 1.5 2.5 4.5 2.5 6 0 1.5 2.5 4.5 2 4.5 0"/><path d="M9 20v-5h6v5"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
}
export default function MobileBottomNav() {
  const pathname = usePathname(); const { count } = useStore(); const [menuOpen, setMenuOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;
  return <>
    {menuOpen && <div className="mobile-menu-backdrop" onClick={()=>setMenuOpen(false)}><div className="mobile-menu-sheet" onClick={e=>e.stopPropagation()}><div className="mobile-menu-heading"><b>منوی ماهان عطر</b><button onClick={()=>setMenuOpen(false)} aria-label="بستن منو">×</button></div><div className="mobile-menu-links"><Link href="/category/spices" onClick={()=>setMenuOpen(false)}>ادویه و چاشنی‌ها</Link><Link href="/category/herbal-plants" onClick={()=>setMenuOpen(false)}>گیاهان دارویی</Link><Link href="/category/herbal-teas" onClick={()=>setMenuOpen(false)}>دمنوش‌های گیاهی</Link><Link href="/blog" onClick={()=>setMenuOpen(false)}>مجله و مقالات</Link><Link href="/track-order" onClick={()=>setMenuOpen(false)}>پیگیری سفارش</Link><Link href="/faq" onClick={()=>setMenuOpen(false)}>سوالات متداول</Link><Link href="/about" onClick={()=>setMenuOpen(false)}>درباره ما</Link><Link href="/contact" onClick={()=>setMenuOpen(false)}>تماس با ما</Link></div></div></div>}
    <nav className="mobile-bottom-nav" aria-label="دسترسی سریع">
      <button className="mobile-nav-item" onClick={()=>setMenuOpen(true)} aria-expanded={menuOpen}><span className="mobile-nav-icon"><Icon name="menu"/></span><span>منو</span></button>
      {links.map(item=><Link key={item.href} href={item.href} className={pathname===item.href || (item.href==="/shop" && (pathname.startsWith("/product") || pathname.startsWith("/category"))) ? "mobile-nav-item active" : "mobile-nav-item"}><span className="mobile-nav-icon"><Icon name={item.icon}/>{item.icon==="cart" && count>0 && <i>{count>99?"۹۹+":count}</i>}</span><span>{item.label}</span></Link>)}
    </nav>
  </>;
}
