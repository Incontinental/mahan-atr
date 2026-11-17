import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { prisma } from "@/lib/prisma";
import { categoryFallbacks } from "@/lib/constants";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, bestsellers, newest, articles, settings] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 8 }),
    prisma.product.findMany({ where: { isActive: true, isBestseller: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.setting.findMany({ where: { key: { in: ["hero_title", "hero_subtitle"] } } })
  ]);
  const values = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const displayOrder = ["powder-onion-parsley", "adviyeh-nacho-cheese", "adviyeh-ranch", "adviyeh-sabzi-pizza"];
  const bestsellersBySlug = new Map(bestsellers.map(product => [product.slug, product] as const));
  const selectedProducts = displayOrder.map(slug => bestsellersBySlug.get(slug)).filter((product): product is NonNullable<typeof product> => Boolean(product));
  const visibleProducts = selectedProducts.length === 4 ? selectedProducts : bestsellers;
  const cats = categories.length ? categories : categoryFallbacks;
  return <>
    <section className="spice-hero">
      <div className="container spice-hero-inner">
        <div className="spice-hero-copy">
          <span className="hero-kicker">ماهان عطر · فروشگاه طعم‌های طبیعی</span>
          <h1>چاشنی سیب‌زمینی!</h1>
          <p className="spice-hero-subtitle">یک سیب‌زمینی و <strong>۹ هزار مزه!</strong></p>
          <p className="spice-hero-description">از چاشنی‌های خوش‌عطر تا ادویه‌های روزمره؛ طعم دلخواهت را پیدا کن و به آشپزی هر روزت حال تازه‌ای بده.</p>
          <div className="button-row"><Link className="btn btn-primary" href="/shop">مشاهده همه محصولات <span>←</span></Link><Link className="btn btn-outline-green" href="/category/spices">دیدن چاشنی‌ها</Link></div>
          <div className="hero-assurance"><span>✓ انتخاب راحت</span><span>✓ اطلاعات شفاف</span><span>✓ خرید آنلاین</span></div>
        </div>
        <div className="spice-hero-visual" aria-hidden="true"><div className="hero-visual-halo"></div><div className="hero-visual-note"><span>طعم تازه</span><b>از دل طبیعت</b></div><Image src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1100&q=90" alt="ترکیب رنگارنگ ادویه و چاشنی" fill priority sizes="(max-width: 760px) 90vw, 44vw"/></div>
      </div>
    </section>

    <section className="section featured-section">
      <div className="container">
        <div className="section-heading spice-section-heading"><div><span className="eyebrow">منتخب ماهان عطر</span><h2>چاشنی‌هایی برای خوش‌طعم‌تر شدن</h2><p>چهار انتخاب محبوب برای شروع یک طعم تازه.</p></div><Link className="text-link" href="/shop">مشاهده همه محصولات ←</Link></div>
        {visibleProducts.length ? <div className="product-grid">{visibleProducts.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="notice">برای نمایش محصولات، ابتدا پایگاه داده را راه‌اندازی و اطلاعات نمونه را وارد کنید.</div>}
        <p className="demo-note">قیمت‌ها و موجودی محصولات اولیه نمونه هستند و پیش از شروع فروش باید در پنل مدیریت بررسی و نهایی شوند.</p>
      </div>
    </section>

    <section className="section categories-section"><div className="container"><SectionTitle eyebrow="دسته‌بندی‌ها" title="از میان محصولات طبیعی انتخاب کن" description="دسترسی سریع به گروه‌های مختلف فروشگاه ماهان عطر." href="/shop"/><div className="category-grid">{cats.slice(0,8).map((c:any)=><Link className="category-card" href={`/category/${c.slug}`} key={c.slug}><Image src={c.image || "/herb-placeholder.svg"} alt={c.name} fill sizes="(max-width:760px) 50vw,25vw"/><div><b>{c.name}</b><small>مشاهده محصولات ←</small></div></Link>)}</div></div></section>

    <section className="section section-soft"><div className="container"><SectionTitle eyebrow="تازه رسیده‌ها" title="تازه‌های فروشگاه" description="محصولات تازه اضافه‌شده به ماهان عطر." href="/shop"/>{newest.length ? <div className="product-grid">{newest.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h3>هنوز محصولی ثبت نشده است</h3><p>به‌زودی محصولات جدید در این بخش نمایش داده می‌شوند.</p></div>}</div></section>

    <section className="container feature-story"><div className="feature-story-image"><Image src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1100&q=90" alt="گیاهان و برگ‌های تازه" fill sizes="(max-width:760px) 100vw,50vw"/></div><div className="feature-story-copy"><span className="eyebrow">نگاهی از نزدیک به طبیعت</span><h2>انتخاب خوب، از اطلاعات روشن شروع می‌شود.</h2><p>در ماهان عطر تلاش می‌کنیم محصول، ترکیبات، وزن و روش نگهداری را شفاف معرفی کنیم تا انتخاب برای شما ساده‌تر باشد. اطلاعات مربوط به محصولات خوراکی و گیاهی جایگزین توصیه تخصصی پزشکی نیست.</p><Link className="btn btn-primary" href="/about">بیشتر درباره ماهان عطر</Link></div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="مجله ماهان" title="چند مطلب خواندنی" description="راهنماهای ساده برای شناخت، انتخاب و نگهداری محصولات طبیعی." href="/blog"/>{articles.length ? <div className="article-grid">{articles.map(a=><article className="article-card" key={a.id}><Link href={`/blog/${a.slug}`} className="article-image"><Image src={a.image || "/herb-placeholder.svg"} alt={a.title} fill sizes="33vw"/></Link><div className="article-copy"><small>مجله ماهان عطر</small><h3><Link href={`/blog/${a.slug}`}>{a.title}</Link></h3><p>{a.excerpt}</p><Link className="text-link" href={`/blog/${a.slug}`}>ادامه مطلب ←</Link></div></article>)}</div> : <p>مقاله‌ای منتشر نشده است.</p>}</div></section>

    <section className="newsletter"><div className="container newsletter-inner"><div><span className="eyebrow">خبرهای خوش‌عطر</span><h2>از تازه‌های ماهان عطر باخبر شو</h2><p>برای اطلاع از محصولات و خبرهای تازه، راه‌های ارتباطی فروشگاه را دنبال کن.</p></div><Link className="btn btn-light" href="/contact">ارتباط با ماهان عطر</Link></div></section>
  </>;
}
