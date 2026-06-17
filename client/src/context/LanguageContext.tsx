import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ar";

const translations = {
  en: {
    // Navigation
    "nav.findDoctor": "Find a Doctor",
    "nav.deals": "Deals",
    "nav.events": "Events",
    "nav.reels": "Reels",
    "nav.aiAssistant": "AI Assistant",
    "nav.dashboard": "Dashboard",
    "nav.forProviders": "For Providers",
    "nav.signIn": "Sign in",
    "nav.getStarted": "Get Started",
    "nav.signOut": "Sign out",
    "nav.pricing": "Pricing",

    // Home
    "home.hero.badge": "🌍 Global Healthcare, Simplified",
    "home.hero.title": "Find & Book a Doctor",
    "home.hero.titleHighlight": "Anywhere in the World",
    "home.hero.subtitle": "Connect with 12,000+ verified healthcare providers in 190+ countries. In-clinic or video — in minutes.",
    "home.hero.searchPlaceholder": "Search by doctor name, specialty, or condition…",
    "home.hero.search": "Search",
    "home.hero.popular": "Popular:",
    "home.stats.countries": "Countries",
    "home.stats.providers": "Verified Providers",
    "home.stats.consultations": "Consultations",
    "home.stats.rating": "Average Rating",
    "home.specialties.title": "Browse by Specialty",
    "home.specialties.subtitle": "Find the right specialist for your needs",
    "home.specialties.seeAll": "See all →",
    "home.featured.title": "Featured Providers",
    "home.featured.subtitle": "Top-rated doctors available now",
    "home.featured.viewAll": "View all →",
    "home.howItWorks.title": "How It Works",
    "home.howItWorks.subtitle": "Get care in three simple steps",
    "home.testimonials.title": "Trusted by Members Worldwide",
    "home.testimonials.subtitle": "Real experiences from real members",
    "home.events.title": "Upcoming Medical Events",
    "home.events.subtitle": "Conferences, webinars, and health summits worldwide",
    "home.cta.title": "Ready to find your doctor?",
    "home.cta.subtitle": "Join thousands of members who manage their health with Qliniqit",
    "home.cta.browse": "Browse Providers",
    "home.cta.ai": "Try AI Assistant",
    "home.cta.pricing": "See Pricing",

    // Auth
    "auth.welcomeBack": "Welcome back",
    "auth.signInSubtitle": "Sign in to manage your appointments.",
    "auth.createAccount": "Create your account",
    "auth.signUpSubtitle": "Join Qliniqit — it's free.",
    "auth.resetPassword": "Reset password",
    "auth.resetSubtitle": "Enter your email and we'll send a reset link.",
    "auth.email": "Email address",
    "auth.password": "Password",
    "auth.fullName": "Full name",
    "auth.signIn": "Sign in",
    "auth.createFree": "Create account — free",
    "auth.sendReset": "Send reset link",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "Don't have an account?",
    "auth.signUpFree": "Sign up free",
    "auth.hasAccount": "Already have an account?",
    "auth.backToSignIn": "← Back to sign in",
    "auth.terms": "By signing in you agree to our",
    "auth.termsLink": "Terms",
    "auth.and": "and",
    "auth.privacyLink": "Privacy Policy",
    "auth.leftTitle": "Your health,\nyour world.",
    "auth.leftSubtitle": "Join thousands of members managing their health with Qliniqit.",
    "auth.consultations": "consultations completed",

    // Dashboard
    "dashboard.title": "Your health dashboard",
    "dashboard.subtitle": "Sign in to manage appointments, view your health history, and access your bookings.",
    "dashboard.signIn": "Sign In",
    "dashboard.createAccount": "Create Account — Free",
    "dashboard.upcoming": "Upcoming Appointments",
    "dashboard.allAppointments": "All Appointments",
    "dashboard.noUpcoming": "No upcoming appointments.",
    "dashboard.findProvider": "Find a provider",
    "dashboard.noAppointments": "No appointments yet.",
    "dashboard.welcomeBack": "Welcome back,",

    // Booking
    "booking.bookAppointment": "Book Appointment",
    "booking.bookNow": "Book Now →",
    "booking.available": "Available for booking",
    "booking.availableSubtitle": "Check available slots and confirm your appointment instantly.",
    "booking.selectDate": "Select a date",
    "booking.selectTime": "Select a time",
    "booking.confirm": "Confirm Booking",
    "booking.cancel": "Cancel",
    "booking.inClinic": "In-clinic",
    "booking.video": "Video consult",
    "booking.fee": "Consultation fee",

    // Provider detail
    "provider.verified": "✓ Verified",
    "provider.featured": "⭐ Featured",
    "provider.reviews": "Member Reviews",
    "provider.noReviews": "No reviews yet — be the first to book and leave a review.",
    "provider.loadMore": "Load more reviews →",
    "provider.similar": "Similar Providers",
    "provider.about": "About",
    "provider.specialty": "Specialty",
    "provider.cancellation": "Cancellation",
    "provider.languages": "Languages",
    "provider.fee": "Fee",
    "provider.backToSearch": "← Back to search",
    "provider.notFound": "Provider not found.",

    // AI Assistant
    "ai.title": "AI Health Assistant",
    "ai.subtitle": "Ask about symptoms, conditions, medications, or find the right specialist.",
    "ai.disclaimer": "Not a substitute for professional medical advice.",
    "ai.placeholder": "Ask a health question…",
    "ai.send": "Send",
    "ai.footer": "AI responses are for informational purposes only and do not constitute medical advice.",
    "ai.tryAsking": "Try asking:",
    "ai.ctaTitle": "Ready to speak to a real doctor?",
    "ai.ctaSubtitle": "Book a verified specialist on Qliniqit",
    "ai.ctaButton": "Find a Doctor",

    // Pricing
    "pricing.title": "Plans for Everyone",
    "pricing.subtitle": "Start free. Upgrade when you're ready.",
    "pricing.forPatients": "For Members",
    "pricing.forProviders": "For Providers",
    "pricing.monthly": "Monthly",
    "pricing.annual": "Annual",
    "pricing.save": "Save 20%",
    "pricing.mostPopular": "Most Popular",
    "pricing.free": "Free",
    "pricing.basic": "Basic",
    "pricing.pro": "Pro",
    "pricing.enterprise": "Enterprise",
    "pricing.getStartedFree": "Get Started Free",
    "pricing.startTrial": "Start Free Trial",
    "pricing.perMonth": "/ mo",
    "pricing.billedAnnually": "Billed annually · save 20%",
    "pricing.faqTitle": "Frequently Asked Questions",
    "pricing.enterpriseTitle": "Enterprise or Hospital Group?",
    "pricing.enterpriseSubtitle": "Custom pricing for large organisations, insurance companies, and government health authorities.",
    "pricing.enterpriseCta": "Contact Enterprise Sales",

    // Reels
    "reels.title": "Health Reels",
    "reels.subtitle": "Expert health tips from verified doctors — in under 10 minutes.",
    "reels.badge": "🎬 Short-form Health Content",
    "reels.searchPlaceholder": "Search reels by topic or doctor…",
    "reels.featured": "⭐ Featured Reels",
    "reels.all": "All Reels",
    "reels.noResults": "No reels found for your search.",
    "reels.clearFilters": "Clear filters",
    "reels.views": "views",
    "reels.providerCta.title": "Are you a healthcare provider?",
    "reels.providerCta.subtitle": "Share your expertise with thousands of members.",
    "reels.providerCta.start": "Start Creating",

    // Events
    "events.title": "Medical Events",
    "events.subtitle": "Conferences, CME, webinars, and health summits worldwide",
    "events.register": "Register",
    "events.submitEvent": "Submit an Event",
    "events.search": "Search events…",

    // Common
    "common.loading": "Loading…",
    "common.error": "Something went wrong.",
    "common.backHome": "Back to home",
    "common.feeOnRequest": "Fee on request",
    "common.perSession": "/ session",
    "common.video": "Video",
    "common.verified": "Verified",
    "common.notFound": "Page not found.",
    "common.notFoundSubtitle": "The page you're looking for doesn't exist.",
    "common.systemsOk": "All systems operational",
    "common.countries": "Available in 190+ countries",
  },

  ar: {
    // Navigation
    "nav.findDoctor": "ابحث عن طبيب",
    "nav.deals": "العروض",
    "nav.events": "الفعاليات",
    "nav.reels": "ريلز الصحة",
    "nav.aiAssistant": "المساعد الذكي",
    "nav.dashboard": "لوحة التحكم",
    "nav.forProviders": "للمزودين",
    "nav.signIn": "تسجيل الدخول",
    "nav.getStarted": "ابدأ الآن",
    "nav.signOut": "تسجيل الخروج",
    "nav.pricing": "الأسعار",

    // Home
    "home.hero.badge": "🌍 الرعاية الصحية العالمية، مُبسَّطة",
    "home.hero.title": "ابحث واحجز موعدك مع طبيب",
    "home.hero.titleHighlight": "في أي مكان في العالم",
    "home.hero.subtitle": "تواصل مع أكثر من 12,000 مزود رعاية صحية موثّق في أكثر من 190 دولة. عيادة أو فيديو — في دقائق.",
    "home.hero.searchPlaceholder": "ابحث باسم الطبيب أو التخصص أو الحالة…",
    "home.hero.search": "بحث",
    "home.hero.popular": "الأكثر بحثاً:",
    "home.stats.countries": "دولة",
    "home.stats.providers": "مزود موثّق",
    "home.stats.consultations": "استشارة",
    "home.stats.rating": "متوسط التقييم",
    "home.specialties.title": "تصفّح حسب التخصص",
    "home.specialties.subtitle": "اعثر على المتخصص المناسب لاحتياجاتك",
    "home.specialties.seeAll": "عرض الكل ←",
    "home.featured.title": "مزودون مميزون",
    "home.featured.subtitle": "أعلى الأطباء تقييماً ومتاحون الآن",
    "home.featured.viewAll": "عرض الكل ←",
    "home.howItWorks.title": "كيف يعمل",
    "home.howItWorks.subtitle": "احصل على الرعاية في ثلاث خطوات بسيطة",
    "home.testimonials.title": "يثق به المرضى حول العالم",
    "home.testimonials.subtitle": "تجارب حقيقية من مرضى حقيقيين",
    "home.events.title": "الفعاليات الطبية القادمة",
    "home.events.subtitle": "مؤتمرات وندوات وقمم صحية حول العالم",
    "home.cta.title": "مستعد لإيجاد طبيبك؟",
    "home.cta.subtitle": "انضم إلى آلاف المرضى الذين يديرون صحتهم مع Qliniqit",
    "home.cta.browse": "تصفح المزودين",
    "home.cta.ai": "جرّب المساعد الذكي",
    "home.cta.pricing": "عرض الأسعار",

    // Auth
    "auth.welcomeBack": "مرحباً بعودتك",
    "auth.signInSubtitle": "سجّل دخولك لإدارة مواعيدك.",
    "auth.createAccount": "أنشئ حسابك",
    "auth.signUpSubtitle": "انضم إلى Qliniqit — مجاناً.",
    "auth.resetPassword": "إعادة تعيين كلمة المرور",
    "auth.resetSubtitle": "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.signIn": "تسجيل الدخول",
    "auth.createFree": "إنشاء حساب — مجاناً",
    "auth.sendReset": "إرسال رابط الاستعادة",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.signUpFree": "سجّل مجاناً",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    "auth.backToSignIn": "← العودة لتسجيل الدخول",
    "auth.terms": "بتسجيل دخولك توافق على",
    "auth.termsLink": "الشروط والأحكام",
    "auth.and": "و",
    "auth.privacyLink": "سياسة الخصوصية",
    "auth.leftTitle": "صحتك،\nعالمك.",
    "auth.leftSubtitle": "انضم إلى آلاف المرضى الذين يديرون رعايتهم الصحية مع Qliniqit.",
    "auth.consultations": "استشارة مكتملة",

    // Dashboard
    "dashboard.title": "لوحة متابعة صحتك",
    "dashboard.subtitle": "سجّل دخولك لإدارة المواعيد وعرض سجلك الصحي والوصول إلى حجوزاتك.",
    "dashboard.signIn": "تسجيل الدخول",
    "dashboard.createAccount": "إنشاء حساب — مجاناً",
    "dashboard.upcoming": "المواعيد القادمة",
    "dashboard.allAppointments": "جميع المواعيد",
    "dashboard.noUpcoming": "لا توجد مواعيد قادمة.",
    "dashboard.findProvider": "ابحث عن مزود",
    "dashboard.noAppointments": "لا توجد مواعيد بعد.",
    "dashboard.welcomeBack": "مرحباً بعودتك،",

    // Booking
    "booking.bookAppointment": "احجز موعداً",
    "booking.bookNow": "احجز الآن ←",
    "booking.available": "متاح للحجز",
    "booking.availableSubtitle": "تحقق من المواعيد المتاحة وأكّد حجزك فوراً.",
    "booking.selectDate": "اختر التاريخ",
    "booking.selectTime": "اختر الوقت",
    "booking.confirm": "تأكيد الحجز",
    "booking.cancel": "إلغاء",
    "booking.inClinic": "في العيادة",
    "booking.video": "استشارة فيديو",
    "booking.fee": "رسوم الاستشارة",

    // Provider detail
    "provider.verified": "✓ موثّق",
    "provider.featured": "⭐ مميز",
    "provider.reviews": "تقييمات المرضى",
    "provider.noReviews": "لا توجد تقييمات بعد — كن أول من يحجز ويترك تقييماً.",
    "provider.loadMore": "تحميل المزيد من التقييمات ←",
    "provider.similar": "مزودون مشابهون",
    "provider.about": "نبذة",
    "provider.specialty": "التخصص",
    "provider.cancellation": "الإلغاء",
    "provider.languages": "اللغات",
    "provider.fee": "الرسوم",
    "provider.backToSearch": "← العودة للبحث",
    "provider.notFound": "لم يُعثر على المزود.",

    // AI Assistant
    "ai.title": "المساعد الصحي الذكي",
    "ai.subtitle": "اسأل عن الأعراض أو الحالات أو الأدوية أو ابحث عن المتخصص المناسب.",
    "ai.disclaimer": "لا يُغني عن الاستشارة الطبية المتخصصة.",
    "ai.placeholder": "اطرح سؤالاً صحياً…",
    "ai.send": "إرسال",
    "ai.footer": "ردود المساعد الذكي للأغراض المعلوماتية فقط ولا تشكّل نصيحة طبية.",
    "ai.tryAsking": "جرّب السؤال عن:",
    "ai.ctaTitle": "مستعد للتحدث مع طبيب حقيقي؟",
    "ai.ctaSubtitle": "احجز مع متخصص موثّق على Qliniqit",
    "ai.ctaButton": "ابحث عن طبيب",

    // Pricing
    "pricing.title": "خطط للجميع",
    "pricing.subtitle": "ابدأ مجاناً. ارقِّ حين تكون مستعداً.",
    "pricing.forPatients": "للأعضاء",
    "pricing.forProviders": "للمزودين",
    "pricing.monthly": "شهري",
    "pricing.annual": "سنوي",
    "pricing.save": "وفّر 20%",
    "pricing.mostPopular": "الأكثر شيوعاً",
    "pricing.free": "مجاني",
    "pricing.basic": "أساسي",
    "pricing.pro": "احترافي",
    "pricing.enterprise": "مؤسسي",
    "pricing.getStartedFree": "ابدأ مجاناً",
    "pricing.startTrial": "ابدأ التجربة المجانية",
    "pricing.perMonth": "/ شهر",
    "pricing.billedAnnually": "يُفوتر سنوياً · وفّر 20%",
    "pricing.faqTitle": "أسئلة مكررة",
    "pricing.enterpriseTitle": "مجموعة مستشفيات أو مؤسسة؟",
    "pricing.enterpriseSubtitle": "أسعار مخصصة للمنظمات الكبيرة وشركات التأمين والجهات الحكومية.",
    "pricing.enterpriseCta": "تواصل مع فريق المؤسسات",

    // Reels
    "reels.title": "ريلز الصحة",
    "reels.subtitle": "نصائح صحية متخصصة من أطباء موثّقين — في أقل من 10 دقائق.",
    "reels.badge": "🎬 محتوى صحي قصير",
    "reels.searchPlaceholder": "ابحث في الريلز بالموضوع أو الطبيب…",
    "reels.featured": "⭐ ريلز مميزة",
    "reels.all": "كل الريلز",
    "reels.noResults": "لا توجد نتائج لبحثك.",
    "reels.clearFilters": "مسح الفلاتر",
    "reels.views": "مشاهدة",
    "reels.providerCta.title": "هل أنت مزود رعاية صحية؟",
    "reels.providerCta.subtitle": "شارك خبرتك مع آلاف المرضى.",
    "reels.providerCta.start": "ابدأ الإنشاء",

    // Events
    "events.title": "الفعاليات الطبية",
    "events.subtitle": "مؤتمرات طبية مستمرة وندوات وقمم صحية حول العالم",
    "events.register": "تسجيل",
    "events.submitEvent": "أضف فعالية",
    "events.search": "ابحث في الفعاليات…",

    // Common
    "common.loading": "جار التحميل…",
    "common.error": "حدث خطأ ما.",
    "common.backHome": "العودة للرئيسية",
    "common.feeOnRequest": "الرسوم عند الطلب",
    "common.perSession": "/ جلسة",
    "common.video": "فيديو",
    "common.verified": "موثّق",
    "common.notFound": "الصفحة غير موجودة.",
    "common.notFoundSubtitle": "الصفحة التي تبحث عنها غير موجودة.",
    "common.systemsOk": "جميع الأنظمة تعمل",
    "common.countries": "متاح في أكثر من 190 دولة",
  },
};

type TranslationKey = keyof (typeof translations)["en"];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("qliniqit-lang");
    return (saved === "ar" || saved === "en") ? saved : "en";
  });

  const isRtl = lang === "ar";

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("qliniqit-lang", l);
  }

  // Apply RTL direction on <html>
  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  function t(key: TranslationKey): string {
    return (translations[lang] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
