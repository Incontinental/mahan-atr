import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/components/StoreProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingActions from "@/components/FloatingActions";
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f7fbf3" };
export const metadata: Metadata = { applicationName: "ماهان عطر", title: "ماهان عطر | فروشگاه ادویه، چاشنی و محصولات طبیعی", description: "خرید ادویه و چاشنی، گیاهان دارویی، دمنوش و محصولات طبیعی از فروشگاه اینترنتی ماهان عطر.", manifest: "/site.webmanifest", icons: { icon: "/favicon.svg" }, metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000") };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fa" dir="rtl"><body><StoreProvider><Header/><main>{children}</main><Footer/><MobileBottomNav/><FloatingActions/></StoreProvider></body></html>; }
