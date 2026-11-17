import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
const schema = z.object({
  customerName: z.string().min(3).max(100), phone: z.string().min(10).max(15), province: z.string().min(2).max(60), city: z.string().min(2).max(60),
  address: z.string().min(8).max(500), postalCode: z.string().min(5).max(15), note: z.string().max(500).optional(),
  items: z.array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(40)
});
export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "اطلاعات سفارش کامل یا معتبر نیست." }, { status: 400 });
    const data = parsed.data;
    const session = await getSession();
    const order = await prisma.$transaction(async tx => {
      const ids = data.items.map(i => i.id);
      const products = await tx.product.findMany({ where: { id: { in: ids }, isActive: true } });
      if (products.length !== ids.length) throw new Error("یکی از محصولات دیگر در دسترس نیست.");
      let subtotal = 0;
      const lines = data.items.map(item => {
        const product = products.find(p => p.id === item.id)!;
        if (product.stock < item.quantity) throw new Error(`موجودی ${product.name} کافی نیست.`);
        const unitPrice = product.salePrice ?? product.price;
        subtotal += unitPrice * item.quantity;
        return { productId: product.id, name: product.name, quantity: item.quantity, unit: product.unit, unitPrice, total: unitPrice * item.quantity };
      });
      const [shippingSetting, minimumSetting] = await Promise.all([
        tx.setting.findUnique({ where: { key: "shipping_flat" } }),
        tx.setting.findUnique({ where: { key: "minimum_order" } })
      ]);
      const minimumOrder = Math.max(0, Number(minimumSetting?.value || 0));
      if (subtotal < minimumOrder) throw new Error(`حداقل مبلغ سفارش ${minimumOrder.toLocaleString("fa-IR")} تومان است.`);
      const shipping = Math.max(0, Number(shippingSetting?.value || 0));
      const number = `MH-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*90+10)}`;
      for (const item of data.items) {
        const changed = await tx.product.updateMany({ where: { id: item.id, isActive: true, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (changed.count !== 1) throw new Error("موجودی یکی از محصولات تغییر کرده است. سبد خرید را دوباره بررسی کنید.");
      }
      const created = await tx.order.create({ data: { orderNumber: number, userId: session?.id, customerName: data.customerName, phone: data.phone, province: data.province, city: data.city, address: data.address, postalCode: data.postalCode, note: data.note || "", subtotal, shipping, total: subtotal + shipping, status: "PENDING_PAYMENT", paymentStatus: "UNPAID", items: { create: lines } }, select: { id:true, orderNumber:true, total:true } });
      return created;
    });
    return NextResponse.json({ success: true, order, paymentAvailable: false, message: "سفارش ثبت شد. پرداخت آنلاین هنوز در تنظیمات فروشگاه فعال نشده است." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ثبت سفارش با خطا روبه‌رو شد.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
