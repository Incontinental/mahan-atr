"use client";
import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
export default function AddToCart({ product }: { product: { id:string; name:string; slug:string; price:number; image:string; unit:string; stock:number } }) {
  const { add } = useStore(); const [notice, setNotice] = useState("");
  return <div><button className="btn btn-dark" disabled={product.stock < 1} onClick={() => { add(product); setNotice("محصول به سبد خرید اضافه شد."); }}>{product.stock < 1 ? "در حال حاضر ناموجود" : "افزودن به سبد خرید"}</button>{notice && <p role="status" style={{color:"var(--green)",fontSize:12}}>{notice}</p>}</div>;
}
