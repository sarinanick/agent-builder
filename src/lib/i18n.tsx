'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Lang = 'en' | 'fa';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    'nav.agentBuilder': 'Agent Builder',
    'nav.marketplace': 'Marketplace',
    // Agent Builder
    'builder.search': 'Insert node...',
    'builder.undo': 'Undo',
    'builder.redo': 'Redo',
    'builder.code': 'Code',
    'builder.preview': 'Preview',
    'builder.deploy': 'Deploy',
    'builder.settings': 'Settings',
    'builder.version': 'v1 · production',
    'builder.label': 'Label',
    'builder.description': 'Description',
    'builder.delete': 'Delete node',
    'builder.model': 'Model',
    'builder.instructions': 'System Instructions',
    'builder.temperature': 'Temperature',
    'builder.tools': 'Tools',
    'builder.expression': 'Expression (CEL)',
    'builder.trueBranch': 'True Branch',
    'builder.falseBranch': 'False Branch',
    'builder.condition': 'Condition',
    'builder.maxIterations': 'Max Iterations',
    'builder.inputSchema': 'Input Schema',
    'builder.outputSchema': 'Output Schema',
    'builder.transformCode': 'Transform Code',
    'builder.variables': 'Variables',
    'builder.vectorStoreId': 'Vector Store ID',
    'builder.topK': 'Top K',
    'builder.scoreThreshold': 'Score Threshold',
    'builder.checkType': 'Check Type',
    'builder.pattern': 'Pattern (Regex)',
    'builder.serverUrl': 'Server URL',
    'builder.toolName': 'Tool Name',
    'builder.parameters': 'Parameters (JSON)',
    'builder.instructions2': 'Instructions',
    'builder.timeout': 'Timeout (seconds)',
    'builder.noteContent': 'Note Content',
    'builder.noConfig': 'No additional configuration available.',
    'builder.export': 'Export Code',
    'builder.chatkit': 'ChatKit',
    'builder.agentsSdk': 'Agents SDK',
    'builder.copy': 'Copy',
    'builder.copied': 'Copied',
    'builder.workflowJson': 'Workflow JSON',
    'builder.previewTitle': 'Preview Workflow',
    'builder.previewPlaceholder': 'Type a message to test the workflow...',
    'builder.previewMode': 'Preview mode — responses are simulated.',
    'builder.deployTitle': 'Deploy Workflow',
    'builder.deployVercel': 'Deploy to Vercel',
    'builder.deploySelf': 'Self-hosted',
    'builder.deployDownload': 'Download Code',
    'builder.deployRecommended': 'Recommended',
    'builder.deployNote': 'Publish a version before deploying.',
    // Marketplace
    'mp.search': 'Search...',
    'mp.filters': 'Filters',
    'mp.clear': 'Clear',
    'mp.tools': 'Tools',
    'mp.price': 'Price (M Tomans)',
    'mp.teamSize': 'Min Team Size',
    'mp.explore': 'Explore',
    'mp.newest': 'Newest',
    'mp.popular': 'Popular',
    'mp.topRated': 'Top Rated',
    'mp.priceDown': 'Price ↓',
    'mp.priceUp': 'Price ↑',
    'mp.loadMore': 'Load more',
    'mp.remaining': 'remaining',
    'mp.noResults': 'No results found',
    'mp.clearFilters': 'Clear filters',
    'mp.favorites': 'My Favorites',
    'mp.noFavorites': 'No favorites yet',
    'mp.doubleClick': 'Double-click on an artwork to save it',
    'mp.collaboration': 'Start Collaboration',
    'mp.download4K': '4K Download',
    'mp.team': 'Team',
    'mp.members': 'members',
    'mp.compare': 'Compare',
    'mp.comparePreparing': 'Comparison preparing...',
    'mp.home': 'Home',
    'mp.exploreTab': 'Explore',
    'mp.favoritesTab': 'Favorites',
    'mp.view': 'View',
    'mp.comingSoon': 'Coming Soon',
    'mp.copyright': '© ARTISANS — All pages and brands are original designs.',
    // Sonora
    'sonora.back': 'Back to Artisans',
    'sonora.startFree': 'Start Free',
    'sonora.subtitle': 'AI MUSIC STUDIO',
    'sonora.title1': 'Turn any idea into a',
    'sonora.title2': 'complete song',
    'sonora.desc': 'Just describe the mood you want; Sonora creates melody, instrumentation, and vocals in seconds.',
    'sonora.generate': 'Generate',
    'sonora.generating': 'Generating...',
    'sonora.trending': 'Trending Tracks This Week',
    'sonora.features': 'Features',
    'sonora.cta': 'Create your first song now',
  },
  fa: {
    // Nav
    'nav.agentBuilder': 'سازنده ایجنت',
    'nav.marketplace': 'بازار',
    // Agent Builder
    'builder.search': 'جستجوی نود...',
    'builder.undo': 'بازگشت',
    'builder.redo': 'بازانجام',
    'builder.code': 'کد',
    'builder.preview': 'پیش‌نمایش',
    'builder.deploy': 'استقرار',
    'builder.settings': 'تنظیمات',
    'builder.version': 'نسخه ۱ · تولید',
    'builder.label': 'عنوان',
    'builder.description': 'توضیحات',
    'builder.delete': 'حذف نود',
    'builder.model': 'مدل',
    'builder.instructions': 'دستورات سیستم',
    'builder.temperature': 'دما',
    'builder.tools': 'ابزارها',
    'builder.expression': 'عبارت (CEL)',
    'builder.trueBranch': 'شاخه درست',
    'builder.falseBranch': 'شاخه غلط',
    'builder.condition': 'شرط',
    'builder.maxIterations': 'حداکثر تکرار',
    'builder.inputSchema': 'اسکمای ورودی',
    'builder.outputSchema': 'اسکمای خروجی',
    'builder.transformCode': 'کد تبدیل',
    'builder.variables': 'متغیرها',
    'builder.vectorStoreId': 'شناسه فروشگاه بردار',
    'builder.topK': 'Top K',
    'builder.scoreThreshold': 'آستانه امتیاز',
    'builder.checkType': 'نوع بررسی',
    'builder.pattern': 'الگو (Regex)',
    'builder.serverUrl': 'آدرس سرور',
    'builder.toolName': 'نام ابزار',
    'builder.parameters': 'پارامترها (JSON)',
    'builder.instructions2': 'دستورات',
    'builder.timeout': 'مهلت (ثانیه)',
    'builder.noteContent': 'محتوای یادداشت',
    'builder.noConfig': 'تنظیم اضافه‌ای وجود ندارد.',
    'builder.export': 'خروجی کد',
    'builder.chatkit': 'ChatKit',
    'builder.agentsSdk': 'Agents SDK',
    'builder.copy': 'کپی',
    'builder.copied': 'کپی شد',
    'builder.workflowJson': 'JSON workflow',
    'builder.previewTitle': 'پیش‌نمایش workflow',
    'builder.previewPlaceholder': 'پیامی بنویسید تا workflow را تست کنید...',
    'builder.previewMode': 'حالت پیش‌نمایش — پاسخ‌ها شبیه‌سازی شده‌اند.',
    'builder.deployTitle': 'استقرار workflow',
    'builder.deployVercel': 'استقرار در Vercel',
    'builder.deploySelf': 'میزبانی شخصی',
    'builder.deployDownload': 'دانلود کد',
    'builder.deployRecommended': 'پیشنهادی',
    'builder.deployNote': 'قبل از استقرار یک نسخه منتشر کنید.',
    // Marketplace
    'mp.search': 'جستجو...',
    'mp.filters': 'فیلترها',
    'mp.clear': 'پاک‌کردن',
    'mp.tools': 'ابزارها',
    'mp.price': 'قیمت (میلیون تومان)',
    'mp.teamSize': 'حداقل اعضای تیم',
    'mp.explore': 'اکسپلور',
    'mp.newest': 'جدیدترین',
    'mp.popular': 'محبوب‌ترین',
    'mp.topRated': 'بیشترین امتیاز',
    'mp.priceDown': 'گران‌ترین',
    'mp.priceUp': 'ارزان‌ترین',
    'mp.loadMore': 'بارگذاری بیشتر',
    'mp.remaining': 'باقی‌مانده',
    'mp.noResults': 'نتیجه‌ای پیدا نشد',
    'mp.clearFilters': 'پاک‌کردن فیلترها',
    'mp.favorites': 'علاقه‌مندی‌های من',
    'mp.noFavorites': 'هنوز چیزی لایک نکردی',
    'mp.doubleClick': 'روی یک اثر دابل‌کلیک کن تا ذخیره بشه',
    'mp.collaboration': 'شروع همکاری',
    'mp.download4K': 'دانلود 4K',
    'mp.team': 'تیم',
    'mp.members': 'عضو',
    'mp.compare': 'مقایسه',
    'mp.comparePreparing': 'در حال آماده‌سازی مقایسه...',
    'mp.home': 'خانه',
    'mp.exploreTab': 'اکسپلور',
    'mp.favoritesTab': 'علاقه‌مندی‌ها',
    'mp.view': 'مشاهده',
    'mp.comingSoon': 'به‌زودی',
    'mp.copyright': '© ARTISANS — تمام صفحات و برندها طراحی اختصاصی ماست.',
    // Sonora
    'sonora.back': 'بازگشت به آرتیزنز',
    'sonora.startFree': 'شروع رایگان',
    'sonora.subtitle': 'استودیوی موسیقی AI',
    'sonora.title1': 'هر ایده رو به یک',
    'sonora.title2': 'ترانه‌ی کامل',
    'sonora.desc': 'فقط توصیف کن چه حسی می‌خوای؛ سونورا ملودی، سازبندی و صدای خواننده رو در چند ثانیه می‌سازه.',
    'sonora.generate': 'تولید کن',
    'sonora.generating': 'در حال ساخت...',
    'sonora.trending': 'ترک‌های ترند این هفته',
    'sonora.features': 'امکانات',
    'sonora.cta': 'اولین ترانه‌ت رو همین حالا بساز',
  },
};

interface I18nContextType {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({ lang: 'en', t: (k) => k, toggleLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
    document.documentElement.dir = saved === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = saved || 'en';
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'fa' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: string) => translations[lang][key] || translations['en'][key] || key;

  return <I18nContext.Provider value={{ lang, t, toggleLang }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
