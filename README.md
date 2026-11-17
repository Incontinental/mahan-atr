# ماهان عطر | فروشگاه اینترنتی

فروشگاه فارسی و راست‌چین با هویت سبز و سفید، طراحی واکنش‌گرا و نوار دسترسی سریع موبایل. این مخزن یک پروژه چندصفحه‌ای Next.js است؛ صرفاً قالب یک‌صفحه‌ای نیست.

## صفحات

- `/` خانه و مجموعه منتخب چاشنی‌ها
- `/shop` فروشگاه، جست‌وجو و فیلتر
- `/category/[slug]` دسته‌بندی مستقل
- `/product/[slug]` جزئیات محصول و انتخاب گزینه
- `/cart` سبد خرید
- `/checkout` ثبت سفارش
- `/account` حساب مشتری
- `/track-order` پیگیری سفارش
- `/about` درباره ما
- `/contact` تماس با ما
- `/blog` و `/blog/[slug]` مجله
- `/faq` سوالات متداول
- `/admin/login` ورود مدیر و `/admin` پنل مدیریت

## فناوری‌ها

Next.js 15، React 19، TypeScript، PostgreSQL، Prisma، Tailwind-independent CSS و JWT session cookie.

## اجرای محلی

نیازمند Node.js نسخه 20.9 یا جدیدتر و یک پایگاه داده PostgreSQL است.

1. فایل `.env.example` را به `.env` کپی کنید.
2. `DATABASE_URL` را با آدرس واقعی PostgreSQL و `AUTH_SECRET` را با یک مقدار تصادفی طولانی پر کنید.
3. اجرا کنید:

```bash
npm install
npx prisma generate --schema=./prisma/schema.prisma
npx prisma db push --schema=./prisma/schema.prisma
npm run db:seed
npm run dev
```

سایت روی `http://localhost:3000` اجرا می‌شود. پنل ورود مدیر در `/admin/login` قرار دارد.

## انتشار روی GitHub و Vercel

**محتویات داخل این پوشه را در ریشه مخزن GitHub قرار دهید. خود پوشه `mahan-atar` را به‌عنوان یک زیرپوشه داخل مخزن نگذارید.** در صفحه اصلی مخزن باید این موارد در کنار `package.json` قابل مشاهده باشند:

```text
app/  components/  lib/  prisma/  public/
package.json  next.config.ts  tsconfig.json  .env.example
```

در Vercel، Repository را انتخاب کنید و `Root Directory` را روی `./` بگذارید. Framework باید Next.js شناسایی شود و Build Command برابر `npm run build` باشد. اسکریپت build مسیر schema را صریحاً تعیین می‌کند تا خطای پیدا نشدن `schema.prisma` رخ ندهد.

### متغیرهای محیطی Vercel

در Settings → Environment Variables این موارد را برای Production و در صورت نیاز Preview تعریف کنید:

- `DATABASE_URL`: آدرس اتصال PostgreSQL
- `AUTH_SECRET`: رشته تصادفی محرمانه و قوی
- `SITE_URL`: دامنه نهایی با `https://`، برای نمونه `https://example.com`
- `ADMIN_PHONE`: شماره مدیر برای ساخت اولیه حساب در seed
- `ADMIN_PASSWORD`: رمز قوی مدیر؛ فقط هنگام اجرای seed لازم است و نباید در Git قرار بگیرد

پس از تنظیم دیتابیس، از یک محیط دارای دسترسی به همان دیتابیس این دستورات را اجرا کنید:

```bash
npx prisma db push --schema=./prisma/schema.prisma
npm run db:seed
```

Seed شامل ۸ دسته‌بندی، ۲۸ محصول نمونه (از جمله چهار چاشنی صفحه مرجع)، ۵ مقاله و تنظیمات اولیه است. اجرای seed برای ساخت مدیر به `ADMIN_PHONE` و `ADMIN_PASSWORD` نیاز دارد.
dd 
## مهم پیش از فروش واقعی

قیمت‌ها، موجودی‌ها، توضیحات و تصاویر نمونه‌اند و باید توسط مدیر بررسی و جایگزین شوند. اطلاعات تماس، نشانی، ساعت کاری و شبکه‌های اجتماعی تا زمان ثبت داده واقعی خالی می‌مانند. درگاه پرداخت ایرانی هنوز به پذیرنده و کلیدهای واقعی متصل نشده و پرداخت موفق شبیه‌سازی نمی‌شود. پیامک، بازیابی رمز عبور، بارگذاری ابری تصاویر، مدیریت کامل تخفیف‌ها و نظرات و گزارش‌های پیشرفته در این نسخه کامل نیستند.

برای فروش واقعی، اتصال و Verify درگاه باید سمت سرور پیاده‌سازی و با داده پذیرنده آزمایش شود. کلیدها را هرگز در کد یا متغیرهای `NEXT_PUBLIC_` قرار ندهید. سیاست مرجوعی، حریم خصوصی، مجوزها، هزینه ارسال و صحت ادعای محصولات نیز باید پیش از انتشار تکمیل شوند.
