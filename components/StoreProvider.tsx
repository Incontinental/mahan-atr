"use client";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type CartItem = { id: string; name: string; slug: string; price: number; image: string; unit: string; quantity: number };
type StoreContextType = { items: CartItem[]; add: (item: Omit<CartItem, "quantity">) => void; remove: (id: string) => void; update: (id: string, quantity: number) => void; clear: () => void; count: number; total: number };
const StoreContext = createContext<StoreContextType | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem("mahan-cart"); if (raw) setItems(JSON.parse(raw)); } catch { /* Ignore unavailable or invalid browser storage. */ } finally { setReady(true); } }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem("mahan-cart", JSON.stringify(items)); } catch { /* Storage may be disabled by the browser. */ } } }, [items, ready]);
  const value = useMemo(() => ({
    items,
    add: (item: Omit<CartItem, "quantity">) => setItems(old => { const found = old.find(x => x.id === item.id); return found ? old.map(x => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x) : [...old, { ...item, quantity: 1 }]; }),
    remove: (id: string) => setItems(old => old.filter(x => x.id !== id)),
    update: (id: string, quantity: number) => setItems(old => quantity < 1 ? old.filter(x => x.id !== id) : old.map(x => x.id === id ? { ...x, quantity: Math.min(quantity, 50) } : x)),
    clear: () => setItems([]),
    count: items.reduce((n, x) => n + x.quantity, 0),
    total: items.reduce((n, x) => n + x.quantity * x.price, 0)
  }), [items]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("useStore must be used inside StoreProvider"); return value; }
