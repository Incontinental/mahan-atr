import Image from "next/image";
import Link from "next/link";
import { toman } from "@/lib/format";
type Product = { id: string; name: string; slug: string; price: number; salePrice?: number | null; image: string; unit: string; stock: number; excerpt?: string; isFeatured?: boolean };
export default function ProductCard({ product }: { product: Product }) {
  const price = product.salePrice ?? product.price;
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-image" aria-label={`مشاهده ${product.name}`}>
      <Image src={product.image || "/herb-placeholder.svg"} alt={product.name} fill sizes="(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 22vw" />
      <span className="image-tag">محصول منتخب</span>
    </Link>
    <div className="product-info">
      <Link href={`/product/${product.slug}`} className="product-title">{product.name}</Link>
      <p className="product-excerpt">{product.excerpt || "انتخابی خوش‌طعم از ماهان عطر"}</p>
      <div className="product-price-row"><strong>{toman(price)}</strong>{product.salePrice ? <del>{toman(product.price)}</del> : null}</div>
      <Link className={`product-options ${product.stock < 1 ? "is-disabled" : ""}`} href={`/product/${product.slug}`} aria-disabled={product.stock < 1}>{product.stock < 1 ? "ناموجود" : "انتخاب گزینه‌ها"}<span aria-hidden="true">⌄</span></Link>
    </div>
  </article>;
}
