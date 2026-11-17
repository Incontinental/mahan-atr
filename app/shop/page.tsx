import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
export const dynamic = "force-dynamic";
type Params = { q?: string; category?: string; sort?: string; page?: string; minPrice?: string; maxPrice?: string; inStock?: string };
export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const page = Math.max(1, Number(params.page || 1) || 1);
  const pageSize = 12;
  const minPrice = params.minPrice ? Math.max(0, Number(params.minPrice) || 0) : undefined;
  const maxPrice = params.maxPrice ? Math.max(0, Number(params.maxPrice) || 0) : undefined;
  const orderBy: Prisma.ProductOrderByWithRelationInput = params.sort === "cheap" ? { price: "asc" } : params.sort === "expensive" ? { price: "desc" } : params.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(q ? { OR: [{ name: { contains: q } }, { excerpt: { contains: q } }] } : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined ? { price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } } : {}),
    ...(params.inStock === "1" ? { stock: { gt: 0 } } : {})
  };
  const [products, categories, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.count({ where })
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  function pageUrl(n: number) { const p = new URLSearchParams(); for (const [key, value] of Object.entries(params)) if (value && key !== "page") p.set(key, value); p.set("page", String(n)); return `/shop?${p.toString()}`; }
  return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / فروشگاه</div><h1>فروشگاه ماهان عطر</h1><p>محصول موردنظرتان را میان انتخاب‌های طبیعی پیدا کنید.</p></div></div><section className="content-section"><div className="container shop-layout"><aside className="filter-box"><h3>دسته‌بندی محصولات</h3><Link href="/shop">همه محصولات</Link>{categories.map(c=><Link href={`/category/${c.slug}`} key={c.id}>{c.name}</Link>)}<h3 style={{marginTop:25}}>فیلتر محصولات</h3><form action="/shop"><input className="field" name="q" defaultValue={q} placeholder="نام محصول..."/><div style={{display:"flex",gap:8,marginTop:9}}><input className="field" type="number" name="minPrice" min="0" defaultValue={params.minPrice} placeholder="حداقل قیمت"/><input className="field" type="number" name="maxPrice" min="0" defaultValue={params.maxPrice} placeholder="حداکثر قیمت"/></div><label style={{display:"flex",gap:8,alignItems:"center",marginTop:12,fontSize:12}}><input type="checkbox" name="inStock" value="1" defaultChecked={params.inStock === "1"}/> فقط کالاهای موجود</label><button className="btn btn-dark" style={{width:"100%",marginTop:14}}>اعمال فیلترها</button></form></aside><div><form action="/shop" className="toolbar"><div><b>{total} محصول</b><span style={{color:"var(--muted)",fontSize:11,marginRight:8}}>در فروشگاه</span></div><div style={{display:"flex",gap:8}}><select className="field" name="sort" defaultValue={params.sort || "newest"}><option value="newest">جدیدترین</option><option value="cheap">ارزان‌ترین</option><option value="expensive">گران‌ترین</option><option value="oldest">قدیمی‌ترین</option></select><button className="btn btn-dark" type="submit">مرتب‌سازی</button></div></form>{products.length ? <><div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div><div className="pagination">{page > 1 && <Link href={pageUrl(page - 1)}>قبلی</Link>}<span>صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span>{page < totalPages && <Link href={pageUrl(page + 1)}>بعدی</Link>}</div></> : <div className="empty-state"><h3>محصولی پیدا نشد</h3><p>عبارت جست‌وجو یا فیلترها را تغییر دهید.</p><Link className="btn btn-dark" href="/shop">نمایش همه محصولات</Link></div>}</div></div></section></>;
}
