import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const categories = [
  ["گیاهان دارویی", "herbal-plants", "گیاهان خشک و طبیعی برای استفاده روزمره و آشپزی", "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=85"],
  ["دمنوش‌های گیاهی", "herbal-teas", "ترکیب‌های خوش‌عطر برای لحظه‌های آرام روز", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85"],
  ["عرقیات گیاهی", "herbal-distillates", "عرقیات گیاهی با بسته‌بندی بهداشتی", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85"],
  ["ادویه‌جات و چاشنی‌ها", "spices", "عطر و رنگی تازه برای آشپزی", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85"],
  ["روغن‌های گیاهی", "herbal-oils", "روغن‌های گیاهی و طبیعی", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=85"],
  ["گل‌ها و گیاهان خشک", "dried-flowers", "گل‌ها و گیاهان معطر خشک‌شده", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85"],
  ["محصولات طبیعی", "natural-products", "انتخابی ساده از دل طبیعت", "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&q=85"],
  ["بسته‌های هدیه", "gift-boxes", "هدیه‌هایی خوش‌عطر و متفاوت", "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=900&q=85"]
];
const products: any[] = [
  // چهار محصول چاشنی که در طرح جدید صفحه اصلی نمایش داده می‌شوند.
  ["ادویه پنیر ناچو", "adviyeh-nacho-cheese", 200000, "بسته ۱۰۰ گرمی", ["spices", "چاشنی پنیر ناچو", "ترکیب چاشنی برای طعم‌دار کردن سیب‌زمینی، اسنک و غذاهای خانگی. ترکیبات دقیق و اطلاعات تولید باید پیش از عرضه توسط مدیر تکمیل شود.", "نامشخص", "در ظرف دربسته و دور از رطوبت و نور مستقیم نگهداری شود.", "ترکیبات و هشدارهای حساسیت روی بسته‌بندی بررسی شود."], "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&q=90"],
  ["پودر پیاز جعفری", "powder-onion-parsley", 168000, "بسته ۱۰۰ گرمی", ["spices", "پودر پیاز و جعفری", "چاشنی خشک با رایحه پیاز و سبزی‌های معطر؛ مناسب استفاده در غذاهای خانگی. ترکیبات دقیق باید روی بسته‌بندی درج شود.", "نامشخص", "در جای خشک و خنک و دور از نور نگهداری شود.", "در صورت حساسیت به هر یک از ترکیبات، برچسب محصول را بررسی کنید."], "https://images.unsplash.com/photo-1547332226-395d746d139a?w=1000&q=90"],
  ["ادویه سبزی پیتزا", "adviyeh-sabzi-pizza", 175000, "بسته ۱۰۰ گرمی", ["spices", "ترکیب سبزی پیتزا", "ترکیب سبزی‌های معطر برای استفاده در پیتزا، پاستا و غذاهای خانگی. ترکیبات دقیق باید پیش از عرضه تأیید شود.", "نامشخص", "در ظرف خشک، دربسته و دور از نور نگهداری شود.", "ترکیبات و هشدارهای حساسیت روی بسته‌بندی بررسی شود."], "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1000&q=90"],
  ["ادویه رنچ", "adviyeh-ranch", 185000, "بسته ۱۰۰ گرمی", ["spices", "چاشنی رنچ", "چاشنی رنچ برای طعم‌دار کردن سس، سیب‌زمینی و میان‌وعده‌ها. ترکیبات و مشخصات محصول باید توسط مدیر فروشگاه تکمیل شود.", "نامشخص", "در بسته‌بندی اصلی و دور از رطوبت نگهداری شود.", "پیش از مصرف، ترکیبات و موارد حساسیت درج‌شده را بررسی کنید."], "https://images.unsplash.com/photo-1771541897176-44a3e01dc484?w=1000&q=90"],
  ["گل گاوزبان", "gol-gavzaban", 98000, "گرم",  ["herbal-plants", "گل گاوزبان خشک", "گل‌های خشک‌شده با عطر و رنگ طبیعی.", "ایران", "در ظرف دربسته، دور از نور و رطوبت نگهداری شود.", "پیش از مصرف، به حساسیت‌های فردی توجه کنید."], "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=85"],
  ["بابونه خشک", "babuneh", 72000, "گرم", ["herbal-plants", "بابونه خشک", "گل بابونه برای تهیه دمنوش و مصارف آشپزی.", "ایران", "در محیط خشک و خنک نگهداری شود.", "در صورت حساسیت به خانواده کاسنی با احتیاط مصرف شود."], "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85"],
  ["نعناع خشک", "naena-khoshk", 48000, "گرم", ["herbal-plants", "نعناع خشک", "نعناع معطر خشک‌شده برای آشپزی و دمنوش.", "ایران", "دور از رطوبت نگهداری شود.", "—"], "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=85"],
  ["آویشن شیرازی", "avishan-shirazi", 68000, "گرم", ["herbal-plants", "آویشن شیرازی", "گیاه معطر مناسب استفاده در غذا و دمنوش.", "ایران", "در ظرف دربسته نگهداری شود.", "—"], "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=85"],
  ["چای ترش", "chai-torsh", 85000, "گرم", ["herbal-teas", "چای ترش", "کاسبرگ خشک چای ترش با رنگ طبیعی.", "مصر", "در جای خشک و خنک نگهداری شود.", "در صورت مصرف دارو یا داشتن شرایط پزشکی، درباره مصرف با متخصص مشورت کنید."], "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85"],
  ["دمنوش به‌لیمو", "damnoosh-behlimo", 90000, "گرم", ["herbal-teas", "دمنوش به‌لیمو", "برگ‌های معطر به‌لیمو برای نوشیدنی گرم.", "ایران", "دور از نور مستقیم نگهداری شود.", "—"], "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85"],
  ["دمنوش آرامش", "damnoosh-aramesh", 125000, "بسته", ["herbal-teas", "ترکیب گیاهی", "ترکیبی از گیاهان معطر برای نوشیدنی روزانه.", "ترکیبی", "در بسته‌بندی اصلی نگهداری شود.", "ترکیبات دقیق پیش از عرضه باید توسط مدیر تکمیل شود."], "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85"],
  ["چای سبز", "chai-sabz", 110000, "گرم", ["herbal-teas", "چای سبز", "چای سبز خشک برای دم‌آوری.", "چین", "در ظرف غیرشفاف و دور از رطوبت.", "دارای کافئین است."], "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85"],
  ["عرق نعناع", "arag-naena", 65000, "بطری ۱ لیتری", ["herbal-distillates", "عرق گیاهی", "عرق نعناع بسته‌بندی‌شده.", "ایران", "طبق دستور درج‌شده روی بطری نگهداری شود.", "از مشخصات درج‌شده روی محصول پیروی کنید."], "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85"],
  ["عرق بیدمشک", "arag-bidmeshk", 98000, "بطری ۱ لیتری", ["herbal-distillates", "عرق گیاهی", "عرق بیدمشک با عطر ملایم.", "ایران", "در محل خنک نگهداری شود.", "—"], "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85"],
  ["عرق گلاب ممتاز", "golab-momtaz", 135000, "بطری ۱ لیتری", ["herbal-distillates", "عرق گل محمدی", "گلاب برای آشپزی و نوشیدنی.", "ایران", "پس از باز شدن طبق برچسب محصول نگهداری شود.", "—"], "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85"],
  ["عرق کاسنی", "arag-kasni", 78000, "بطری ۱ لیتری", ["herbal-distillates", "عرق گیاهی", "عرق کاسنی بسته‌بندی‌شده.", "ایران", "در محل خنک و دور از نور نگهداری شود.", "درباره سازگاری با شرایط پزشکی یا داروها از متخصص سؤال کنید."], "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85"],
  ["زردچوبه قلم", "zardchoobeh", 52000, "گرم", ["spices", "زردچوبه", "زردچوبه آسیاب‌نشده برای حفظ عطر.", "هند", "دور از رطوبت نگهداری شود.", "—"], "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85"],
  ["دارچین سیلان", "darchin-ceylon", 115000, "گرم", ["spices", "دارچین", "چوب دارچین معطر.", "سریلانکا", "در ظرف دربسته نگهداری شود.", "—"], "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85"],
  ["هل سبز", "hael-sabz", 185000, "گرم", ["spices", "هل سبز", "هل سبز خوش‌عطر برای چای و شیرینی.", "هند", "دور از نور و رطوبت.", "—"], "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85"],
  ["فلفل سیاه دانه", "felfel-siah", 78000, "گرم", ["spices", "فلفل سیاه", "دانه فلفل سیاه برای آسیاب تازه.", "هند", "در ظرف خشک نگهداری شود.", "—"], "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85"],
  ["روغن کنجد", "roghan-konjed", 210000, "بطری ۲۵۰ میلی‌لیتر", ["herbal-oils", "روغن کنجد", "روغن کنجد خوراکی.", "ایران", "طبق برچسب محصول نگهداری شود.", "برای مصرف خوراکی، برچسب محصول را بررسی کنید."], "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=85"],
  ["روغن سیاهدانه", "roghan-siahdooneh", 195000, "بطری ۱۰۰ میلی‌لیتر", ["herbal-oils", "روغن گیاهی", "روغن سیاهدانه در بسته‌بندی کوچک.", "ایران", "دور از نور و گرما.", "مصرف خوراکی یا موضعی فقط مطابق برچسب معتبر محصول."], "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=85"],
  ["روغن بادام شیرین", "roghan-badam", 175000, "بطری ۱۰۰ میلی‌لیتر", ["herbal-oils", "روغن بادام", "روغن بادام شیرین برای مصارف آرایشی.", "ایران", "در محل خنک نگهداری شود.", "پیش از مصرف موضعی، تست حساسیت انجام شود."], "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=85"],
  ["گل محمدی خشک", "gol-mohammadi", 120000, "گرم", ["dried-flowers", "گل محمدی", "گلبرگ‌های خشک برای دمنوش و تزئین.", "ایران", "در بسته‌بندی دربسته نگهداری شود.", "—"], "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85"],
  ["بهارنارنج خشک", "baharnarenj", 145000, "گرم", ["dried-flowers", "بهارنارنج", "شکوفه خشک بهارنارنج با عطر دلنشین.", "ایران", "دور از رطوبت و نور.", "—"], "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85"],
  ["عسل طبیعی نمونه", "asal-tabiei", 320000, "شیشه ۵۰۰ گرمی", ["natural-products", "عسل", "نمونه نمایشی عسل؛ مشخصات تولیدکننده باید پیش از فروش تکمیل شود.", "نامشخص", "طبق برچسب تولیدکننده.", "منشأ و اصالت باید پیش از فروش تأیید شود."], "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&q=85"],
  ["سرکه سیب طبیعی", "serke-sib", 125000, "بطری ۱ لیتری", ["natural-products", "سرکه سیب", "سرکه سیب برای استفاده خوراکی.", "ایران", "طبق برچسب محصول.", "—"], "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&q=85"],
  ["جعبه هدیه دمنوش", "gift-damnoosh", 490000, "بسته", ["gift-boxes", "بسته هدیه", "مجموعه‌ای از چند دمنوش نمونه در بسته‌بندی هدیه.", "ترکیبی", "در جای خشک نگهداری شود.", "محتویات بسته باید پیش از فروش توسط مدیر تأیید شود."], "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=900&q=85"]
];
async function main() {
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await prisma.category.upsert({ where: { slug: c[1] }, update: {}, create: { name: c[0], slug: c[1], description: c[2], image: c[3], sortOrder: i } });
  }
  for (let i = 0; i < products.length; i++) {
    const p = products[i]; const cat = await prisma.category.findUniqueOrThrow({ where: { slug: p[4][0] } });
    await prisma.product.upsert({ where: { slug: p[1] }, update: {}, create: {
      name: p[0], slug: p[1], price: p[2], unit: p[3], categoryId: cat.id,
      excerpt: p[4][1], description: p[4][2], ingredients: p[4][1], origin: p[4][3], storage: p[4][4], warnings: p[4][5],
      image: p[5], images: p[5], stock: 20, isFeatured: i < 8, isBestseller: i < 5, isActive: true,
      unitOptions: "50,100,250", seoTitle: p[0] + " | ماهان عطر"
    } });
  }
  const articles = [
    ["چطور دمنوش را درست دم کنیم؟", "how-to-brew-herbal-tea", "چند نکته ساده برای آماده‌سازی یک فنجان دمنوش خوش‌عطر.", "برای دم‌آوری دمنوش، از آب تازه و ظرف تمیز استفاده کنید. دمای آب و زمان دم‌آوری به نوع گیاه بستگی دارد؛ دستور روی بسته‌بندی را در اولویت قرار دهید. پس از دم‌کشیدن، نوشیدنی را صاف کنید و از نگهداری طولانی‌مدت در دمای اتاق خودداری کنید."],
    ["راهنمای نگهداری گیاهان خشک", "store-dried-herbs", "چگونه عطر و کیفیت گیاهان خشک را بهتر حفظ کنیم؟", "گیاهان خشک را در ظرف تمیز، خشک و دربسته نگهداری کنید. رطوبت، نور مستقیم و گرمای زیاد می‌تواند کیفیت آن‌ها را کاهش دهد. برای جلوگیری از اشتباه، نام محصول و تاریخ خرید را روی ظرف بنویسید."],
    ["ادویه تازه چه تفاوتی ایجاد می‌کند؟", "fresh-spices", "نگاهی به عطر ادویه و روش نگهداری درست آن.", "ادویه کامل معمولاً دیرتر از نوع آسیاب‌شده عطر خود را از دست می‌دهد. خرید به اندازه نیاز و نگهداری در ظرف دربسته به حفظ عطر کمک می‌کند. برای هر ادویه، شرایط درج‌شده روی بسته‌بندی را بررسی کنید."],
    ["آشنایی با گل محمدی", "rose-petals", "گلبرگ‌های معطر و کاربردهای روزمره آن‌ها.", "گل محمدی در آشپزی، نوشیدنی‌ها و تزئین خوراکی کاربرد دارد. کیفیت محصول به تازگی، روش خشک‌کردن و شرایط نگهداری بستگی دارد. این مطلب صرفاً اطلاعات عمومی است و توصیه درمانی محسوب نمی‌شود."],
    ["برچسب محصولات گیاهی را چگونه بخوانیم؟", "read-herbal-label", "مواردی که پیش از خرید بهتر است بررسی کنید.", "نام دقیق محصول، مواد تشکیل‌دهنده، وزن، تاریخ تولید و انقضا، نام تولیدکننده و شرایط نگهداری از موارد مهم برچسب هستند. برای محصولات خوراکی یا موضعی، هشدارهای درج‌شده را جدی بگیرید و در صورت ابهام از فروشنده اطلاعات مستند بخواهید."]
  ];
  const ac = await prisma.articleCategory.upsert({ where: { slug: "guides" }, update: {}, create: { name: "راهنمای خرید و نگهداری", slug: "guides" } });
  for (const a of articles) await prisma.article.upsert({ where: { slug: a[1] }, update: {}, create: { title: a[0], slug: a[1], excerpt: a[2], body: a[3], categoryId: ac.id, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=85", isPublished: true } });
  const settings: Record<string, string> = {
    store_name: "ماهان عطر", store_phone: "", store_mobile: "", store_address: "", store_hours: "", instagram: "", telegram: "",
    about_title: "بازگشت به سادگی طبیعت", about_text: "ماهان عطر فضایی برای انتخاب آگاهانه محصولات گیاهی، دمنوش‌ها و چاشنی‌های طبیعی است. اطلاعات این بخش از پنل مدیریت قابل تکمیل و ویرایش است.",
    shipping_flat: "0", shipping_method: "هماهنگی پس از ثبت سفارش", minimum_order: "0", payment_enabled: "false",
    hero_title: "طبیعت، در عطر و طعم زندگی", hero_subtitle: "انتخابی آرام و آگاهانه از میان گیاهان، دمنوش‌ها و طعم‌های طبیعی.",
    footer_text: "ماهان عطر؛ همراه لحظه‌های خوش‌عطر زندگی.",
    faq_items: JSON.stringify([
      ["چطور سفارش ثبت کنم؟", "محصول موردنظر را به سبد خرید اضافه کنید، اطلاعات ارسال را وارد کنید و سفارش را ثبت کنید."],
      ["آیا قیمت‌ها قطعی هستند؟", "قیمت نمونه در نسخه اولیه صرفاً برای نمایش است. قیمت نهایی هر محصول در پنل مدیریت تنظیم می‌شود."],
      ["سفارش‌ها چه زمانی ارسال می‌شوند؟", "زمان آماده‌سازی و ارسال پس از نهایی شدن روش ارسال در تنظیمات فروشگاه اعلام می‌شود."],
      ["چطور سفارش را پیگیری کنم؟", "شماره سفارش و شماره تلفن ثبت‌شده را در صفحه پیگیری سفارش وارد کنید."],
      ["امکان لغو سفارش وجود دارد؟", "درخواست لغو پیش از ارسال، مطابق شرایط فروشگاه بررسی می‌شود."],
      ["آیا محصولات تاریخ مصرف دارند؟", "اطلاعات تاریخ تولید و انقضا باید روی بسته‌بندی محصول و در مشخصات آن درج شود."],
      ["چطور با فروشگاه تماس بگیرم؟", "از فرم صفحه تماس با ما استفاده کنید."],
      ["آیا محصولات خاصیت درمانی قطعی دارند؟", "خیر. محصولات این فروشگاه جایگزین تشخیص یا درمان پزشکی نیستند."]
    ])
  };
  for (const [key, value] of Object.entries(settings)) await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  const roles = [
    ["SUPER_ADMIN", "products,orders,users,categories,content,settings,reports"],
    ["STORE_MANAGER", "products,orders,categories,content,reports"],
    ["ORDER_OPERATOR", "orders,customers"]
  ];
  for (const [name, permissions] of roles) await prisma.adminRole.upsert({ where: { name }, update: { permissions }, create: { name, permissions } });
  await prisma.banner.upsert({ where: { id: "mahan-main-banner" }, update: {}, create: { id: "mahan-main-banner", title: "طبیعت، در عطر و طعم زندگی", subtitle: "از دل طبیعت، برای لحظه‌های ساده و دلنشین", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1800&q=90", link: "/shop", sortOrder: 0 } });
  const phone = process.env.ADMIN_PHONE; const password = process.env.ADMIN_PASSWORD;
  if (phone && password) {
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({ where: { phone }, update: { passwordHash: hash, role: "SUPER_ADMIN" }, create: { phone, name: "مدیر ماهان عطر", passwordHash: hash, role: "SUPER_ADMIN" } });
    console.log("Admin user created/updated from ADMIN_PHONE and ADMIN_PASSWORD.");
  } else console.log("Admin user skipped. Set ADMIN_PHONE and ADMIN_PASSWORD before seeding to create a super admin.");
  console.log("Seed complete: 8 categories, 28 demo products, 5 articles.");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
