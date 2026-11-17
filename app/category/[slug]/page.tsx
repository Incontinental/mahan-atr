import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const category = await prisma.category.findUnique({ where: { slug }, include: { products: { where: { isActive: true }, orderBy: { createdAt: "desc" } } } });
  if (!category) notFound();
  return <><div className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">خانه</Link> / <Link href="/shop">فروشگاه</Link> / {category.name}</div><h1>{category.name}</h1><p>{category.description}</p></div></div><section className="content-section"><div className="container">{category.image && <div style={{height:230,position:"relative",marginBottom:30,overflow:"hidden"}}><Image src={category.image} alt={category.name} fill style={{objectFit:"cover"}}/></div>}{category.products.length ? <div className="product-grid">{category.products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h3>هنوز محصولی در این دسته ثبت نشده است.</h3><Link className="btn btn-dark" href="/shop">مشاهده فروشگاه</Link></div>}</div></section></>;
}
