# استقرار ماهان عطر روی Vercel

1. محتویات پوشه پروژه را در ریشه مخزن GitHub قرار دهید؛ پوشه‌های `app`, `components`, `lib`, `prisma`, `public` و فایل `package.json` باید در ریشه باشند.
2. مخزن را در Vercel Import کنید.
3. در تنظیمات پروژه، Root Directory را `./` قرار دهید.
4. Build Command را `npm run build` بگذارید.
5. یک PostgreSQL مدیریت‌شده بسازید و `DATABASE_URL` را در Vercel ثبت کنید.
6. `AUTH_SECRET` و `SITE_URL` را اضافه کنید. برای ساخت مدیر، `ADMIN_PHONE` و `ADMIN_PASSWORD` را هنگام اجرای seed در محیط امن تنظیم کنید.
7. روی دیتابیس تولید، یک بار `npx prisma db push --schema=./prisma/schema.prisma` و سپس `npm run db:seed` را اجرا کنید.
8. پس از ثبت Environment Variables، یک Redeploy انجام دهید.
9. صفحات خانه، محصول، سبد، checkout، حساب، پیگیری و پنل مدیر را آزمایش کنید.

## نکات Vercel و Prisma

- فایل `prisma/schema.prisma` باید در GitHub و در مسیر `prisma/schema.prisma` نسبت به Root Directory وجود داشته باشد.
- `package.json` هم مسیر Prisma را به‌صورت `./prisma/schema.prisma` مشخص می‌کند و هم دستور Build از `--schema` استفاده می‌کند.
- Vercel Build صرفاً `prisma generate` و Next.js را اجرا می‌کند؛ مهاجرت/ساخت جداول دیتابیس باید با دیتابیس واقعی انجام شود.
- اگر مخزن پروژه داخل یک پوشه تو در تو قرار گرفته باشد، Root Directory باید همان پوشه‌ای باشد که `package.json` و `prisma/` در آن کنار هم هستند. در بسته حاضر، محتویات آماده‌اند تا مستقیماً در ریشه مخزن قرار گیرند.

## متغیرهای محیطی نمونه

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/mahan_atar?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
SITE_URL="https://your-domain.example"
ADMIN_PHONE="09xxxxxxxxx"
ADMIN_PASSWORD="replace-with-a-strong-password"
```

رمزها و آدرس دیتابیس واقعی را در GitHub commit نکنید. `ADMIN_PASSWORD` را بعد از ساخت حساب مدیر از تنظیمات محیطی seed حذف کنید.
