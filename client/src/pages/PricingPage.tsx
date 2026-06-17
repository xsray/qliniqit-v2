import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "../context/LanguageContext";
import { Check, X, Zap, Lock, MessageSquare, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const PATIENT_PLANS = [
  {
    id: "free",
    nameKey: "pricing.free" as const,
    price: { monthly: 0, annual: 0 },
    descriptionEn: "For members who need basic access to providers.",
    descriptionAr: "للمرضى الذين يحتاجون وصولاً أساسياً لمزودي الرعاية.",
    featuresEn: ["Search 12,000+ providers", "Book up to 3 appointments/month", "Verified reviews", "Basic appointment reminders", "In-clinic & video consultations", "Mobile app access"],
    featuresAr: ["البحث في أكثر من 12,000 مزود", "حجز ما يصل إلى 3 مواعيد شهرياً", "تقييمات موثّقة", "تذكيرات أساسية للمواعيد", "استشارات في العيادة والفيديو", "الوصول عبر التطبيق"],
    notIncludedEn: ["AI Health Assistant", "Health Vault & Records", "Family member profiles", "Priority support"],
    notIncludedAr: ["المساعد الصحي الذكي", "الملف الصحي والسجلات", "ملفات أفراد العائلة", "الدعم الأولوي"],
  },
  {
    id: "basic",
    nameKey: "pricing.basic" as const,
    price: { monthly: 9, annual: 7 },
    descriptionEn: "For members who want smarter tools to manage their health.",
    descriptionAr: "للمرضى الذين يريدون أدوات أذكى لإدارة صحتهم.",
    highlight: true,
    featuresEn: ["Everything in Free", "Unlimited appointments", "AI Health Assistant", "Health Vault (50 docs)", "Health Timeline", "2 Family member profiles", "Priority booking", "Monthly health insights"],
    featuresAr: ["كل ما في المجاني", "مواعيد غير محدودة", "المساعد الصحي الذكي", "ملف صحي (50 وثيقة)", "جدول زمني صحي", "ملفان لأفراد العائلة", "حجز أولوية", "تقرير صحي شهري"],
    notIncludedEn: ["Unlimited family members", "Dedicated support manager"],
    notIncludedAr: ["أفراد عائلة غير محدودين", "مدير دعم مخصص"],
  },
  {
    id: "pro",
    nameKey: "pricing.pro" as const,
    price: { monthly: 25, annual: 19 },
    descriptionEn: "For families and power users who want complete coverage.",
    descriptionAr: "للعائلات والمستخدمين المتقدمين الذين يريدون تغطية كاملة.",
    accentGrad: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))",
    featuresEn: ["Everything in Basic", "Unlimited family members", "Unlimited Health Vault", "Insurance & billing support", "Referral management", "Health quiz & assessments", "Dedicated support manager", "500 Qliniqit Credits/month", "Early access to new features"],
    featuresAr: ["كل ما في الأساسي", "أفراد عائلة غير محدودين", "ملف صحي غير محدود", "دعم التأمين والفواتير", "إدارة الإحالات", "اختبارات وتقييمات صحية", "مدير دعم مخصص", "500 رصيد Qliniqit شهرياً", "وصول مبكر للميزات الجديدة"],
  },
];

const PROVIDER_PLANS = [
  {
    id: "free",
    nameKey: "pricing.free" as const,
    price: { monthly: 0, annual: 0 },
    descriptionEn: "List your practice and get discovered by members worldwide.",
    descriptionAr: "أضف عيادتك وابدأ بالظهور للمرضى حول العالم.",
    featuresEn: ["Public profile listing", "Up to 20 appointments/month", "Basic analytics", "Member reviews", "Verification badge"],
    featuresAr: ["إدراج الملف العام", "ما يصل إلى 20 موعداً شهرياً", "تحليلات أساسية", "تقييمات المرضى", "شارة التحقق"],
  },
  {
    id: "pro",
    nameKey: "pricing.pro" as const,
    price: { monthly: 49, annual: 39 },
    descriptionEn: "Grow your practice with powerful professional tools.",
    descriptionAr: "طوّر ممارستك بأدوات احترافية قوية.",
    highlight: true,
    featuresEn: ["Everything in Free", "Unlimited appointments", "Teleconsultation rooms", "Health Reels (5/month)", "Featured profile badge", "Advanced scheduling", "Member CRM & notes", "Revenue analytics", "Google Calendar sync"],
    featuresAr: ["كل ما في المجاني", "مواعيد غير محدودة", "غرف استشارة فيديو", "ريلز صحية (5 شهرياً)", "شارة ملف مميز", "جدولة متقدمة", "إدارة المرضى والملاحظات", "تحليلات الإيرادات", "مزامنة تقويم Google"],
  },
  {
    id: "enterprise",
    nameKey: "pricing.enterprise" as const,
    price: { monthly: 199, annual: 159 },
    descriptionEn: "For clinics, hospitals, and multi-provider groups.",
    descriptionAr: "للعيادات والمستشفيات ومجموعات المزودين.",
    accentGrad: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))",
    featuresEn: ["Everything in Pro", "Up to 20 providers per account", "Clinic-level analytics", "Unlimited reels", "Sponsorship tools", "API access", "Dedicated onboarding", "SLA support"],
    featuresAr: ["كل ما في الاحترافي", "ما يصل إلى 20 مزوداً", "تحليلات على مستوى العيادة", "ريلز غير محدودة", "أدوات الرعاية", "وصول API", "تأهيل مخصص", "دعم SLA"],
  },
];

const FAQS_EN = [
  { q: "Can I cancel my subscription anytime?", a: "Yes. You can cancel at any time from your account settings. Your access continues until the end of the billing period." },
  { q: "What are Qliniqit Credits?", a: "Credits are our in-app currency. Pro members receive 500 credits/month. Use them for priority bookings, consultation top-ups, and exclusive provider deals." },
  { q: "Is there a free trial?", a: "Yes — the Basic plan includes a 14-day free trial. No credit card required." },
  { q: "Do you offer insurance billing support?", a: "Pro plan members get access to our insurance liaison team who can help with AXA Gulf, Daman, Bupa, and other major providers in MENA." },
  { q: "Can I switch plans mid-cycle?", a: "Absolutely. Upgrades take effect immediately (prorated). Downgrades take effect at the next renewal." },
];
const FAQS_AR = [
  { q: "هل يمكنني إلغاء اشتراكي في أي وقت؟", a: "نعم. يمكنك الإلغاء في أي وقت من إعدادات حسابك. يستمر وصولك حتى نهاية فترة الفوترة." },
  { q: "ما هي أرصدة Qliniqit؟", a: "الأرصدة هي عملتنا داخل التطبيق. يحصل أعضاء Pro على 500 رصيد شهرياً." },
  { q: "هل هناك تجربة مجانية؟", a: "نعم — تتضمن خطة Basic تجربة مجانية لمدة 14 يوماً. لا يلزم بطاقة ائتمانية." },
  { q: "هل تقدمون دعماً للفواتير والتأمين؟", a: "يحصل أعضاء Pro على فريق متخصص يساعد في التعامل مع AXA Gulf وDaman وBupa." },
  { q: "هل يمكنني تغيير خطتي في منتصف الدورة؟", a: "بالتأكيد. الترقيات تسري فوراً (بحساب نسبي). التخفيضات تسري عند التجديد التالي." },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [tab, setTab] = useState<"members" | "providers">("members");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const plans = tab === "members" ? PATIENT_PLANS : PROVIDER_PLANS;
  const faqs = lang === "ar" ? FAQS_AR : FAQS_EN;
  const isAr = lang === "ar";

  return (
    <main>
      {/* ── Hero header ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white py-20 px-6"
        style={{ background: "linear-gradient(145deg, oklch(0.22 0.18 262) 0%, oklch(0.32 0.22 262) 50%, oklch(0.38 0.26 285) 100%)" }}
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.54 0.24 290 / 0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 65 / 0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 glass text-white/80 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5 text-highlight-300" strokeWidth={2.5} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {t("pricing.title")}
          </h1>
          <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto">{t("pricing.subtitle")}</p>

          {/* Member / Provider toggle */}
          <div className="inline-flex bg-white/8 border border-white/12 rounded-2xl p-1 mb-8">
            {(["members", "providers"] as const).map(t_ => (
              <button key={t_} onClick={() => setTab(t_)}
                className={`px-7 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  tab === t_ ? "bg-white text-primary-700 shadow-md" : "text-white/60 hover:text-white"
                }`}>
                {t_ === "members" ? t("pricing.forPatients") : t("pricing.forProviders")}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setBilling("monthly")}
              className={`text-sm font-semibold transition-colors ${billing === "monthly" ? "text-white" : "text-white/40 hover:text-white"}`}>
              {t("pricing.monthly")}
            </button>
            <div onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
              className="relative w-12 h-6 rounded-full cursor-pointer transition-all"
              style={{ background: billing === "annual" ? "linear-gradient(135deg, oklch(0.75 0.18 65), oklch(0.66 0.19 65))" : "rgba(255,255,255,0.2)" }}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${billing === "annual" ? "translate-x-7" : "translate-x-1"}`} />
            </div>
            <button onClick={() => setBilling("annual")}
              className={`text-sm font-semibold transition-colors flex items-center gap-2 ${billing === "annual" ? "text-white" : "text-white/40 hover:text-white"}`}>
              {t("pricing.annual")}
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-gray-900"
                style={{ background: "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.68 0.20 52))" }}>
                {t("pricing.save")}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plan cards ──────────────────────────────────────── */}
      <section
        className="px-6 pb-16 -mt-4"
        style={{ background: "linear-gradient(180deg, oklch(0.97 0.015 285) 0%, #fff 30%)" }}
      >
        <div className="max-w-5xl mx-auto pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => {
              const price = billing === "annual" ? plan.price.annual : plan.price.monthly;
              const desc = isAr ? plan.descriptionAr : plan.descriptionEn;
              const features = (isAr ? plan.featuresAr : plan.featuresEn) ?? [];
              const notIncluded = isAr
                ? (plan as any).notIncludedAr as string[] | undefined
                : (plan as any).notIncludedEn as string[] | undefined;
              const isHighlight = plan.highlight;
              const accentGrad = (plan as any).accentGrad as string | undefined;

              if (isHighlight) {
                // Featured card — dark gradient
                return (
                  <div key={plan.id} className="relative rounded-3xl overflow-hidden shadow-2xl -mt-4">
                    {/* Background */}
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(145deg, oklch(0.22 0.18 262) 0%, oklch(0.32 0.22 262) 55%, oklch(0.38 0.26 285) 100%)" }} />
                    {/* Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                    {/* Orb */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none"
                      style={{ background: "radial-gradient(circle, oklch(0.54 0.24 290 / 0.3) 0%, transparent 70%)" }} />

                    <div className="relative p-7">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 glass text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
                        <Zap className="w-3 h-3 text-highlight-300" strokeWidth={2.5} />
                        {t("pricing.mostPopular")}
                      </div>

                      <h3 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                        {t(plan.nameKey)}
                      </h3>
                      <p className="text-white/50 text-sm mb-6">{desc}</p>

                      <div className="mb-6">
                        <div className="flex items-end gap-1">
                          <span className="text-5xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                            {price === 0 ? t("pricing.free") : `$${price}`}
                          </span>
                          {price > 0 && <span className="text-white/40 text-sm mb-2">{t("pricing.perMonth")}</span>}
                        </div>
                        {billing === "annual" && price > 0 && (
                          <p className="text-xs text-highlight-300 mt-1 font-medium">{t("pricing.billedAnnually")}</p>
                        )}
                      </div>

                      <Link href="/login"
                        className="block w-full text-center py-3.5 rounded-2xl font-bold text-sm mb-7 transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        style={{ background: "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.68 0.20 52))", color: "oklch(0.15 0.05 262)" }}>
                        {price === 0 ? t("pricing.getStartedFree") : t("pricing.startTrial")}
                      </Link>

                      <ul className="space-y-3">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                            <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-highlight-300" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                        {notIncluded?.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-white/25 line-through">
                            <X className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              }

              // Standard card
              return (
                <div key={plan.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all card-hover-glow">
                  {/* Accent strip */}
                  <div className="h-1" style={{ background: accentGrad ?? "linear-gradient(90deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }} />

                  <div className="p-7">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {t(plan.nameKey)}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">{desc}</p>

                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span
                          className="text-4xl font-extrabold"
                          style={{
                            fontFamily: "var(--font-heading)",
                            background: accentGrad ?? "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {price === 0 ? t("pricing.free") : `$${price}`}
                        </span>
                        {price > 0 && <span className="text-gray-400 text-sm mb-1.5">{t("pricing.perMonth")}</span>}
                      </div>
                      {billing === "annual" && price > 0 && (
                        <p className="text-xs text-primary-500 mt-1 font-medium">{t("pricing.billedAnnually")}</p>
                      )}
                    </div>

                    <Link href="/login"
                      className="block w-full text-center py-3.5 rounded-2xl font-bold text-sm mb-7 border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ borderColor: "oklch(0.84 0.10 262)", color: "oklch(0.47 0.22 262)" }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))";
                        el.style.color = "white";
                        el.style.borderColor = "transparent";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = "";
                        el.style.color = "oklch(0.47 0.22 262)";
                        el.style.borderColor = "oklch(0.84 0.10 262)";
                      }}
                    >
                      {price === 0 ? t("pricing.getStartedFree") : t("pricing.startTrial")}
                    </Link>

                    <ul className="space-y-2.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-500" strokeWidth={2.5} />
                          {f}
                        </li>
                      ))}
                      {notIncluded?.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300 line-through">
                          <X className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust row ───────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-10 text-center border"
            style={{
              background: "linear-gradient(135deg, oklch(0.97 0.02 262), oklch(0.95 0.04 285))",
              borderColor: "oklch(0.90 0.06 262)",
            }}
          >
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {isAr ? "لست متأكداً من أي خطة؟" : "Not sure which plan?"}
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              {isAr
                ? "ابدأ بالمجاني وارقِّ في أي وقت. معظم المستخدمين يجدون Basic كافياً."
                : "Start free and upgrade anytime. Most users find Basic covers everything they need."}
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { Icon: Zap,           label: isAr ? "تجربة مجانية" : "Free Trial",    val: "14 days",                 grad: "linear-gradient(135deg, oklch(0.75 0.18 65), oklch(0.66 0.19 65))" },
                { Icon: Lock,          label: isAr ? "إلغاء في أي وقت" : "Cancel Anytime", val: isAr ? "بدون إلزام" : "No lock-in", grad: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" },
                { Icon: MessageSquare, label: isAr ? "دعم" : "Support",                 val: "24/7",                    grad: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" },
              ].map(i => (
                <div key={i.label} className="text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"
                    style={{ background: i.grad }}>
                    <i.Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>{i.val}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{i.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            {t("pricing.faqTitle")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary-500 flex-shrink-0" strokeWidth={2.5} />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2.5} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-gray-50">
                    <p className="text-sm text-gray-500 leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise CTA ──────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-12 text-center text-white"
            style={{ background: "linear-gradient(145deg, oklch(0.22 0.18 262) 0%, oklch(0.32 0.22 262) 50%, oklch(0.38 0.26 285) 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative">
              <h3 className="text-3xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                {t("pricing.enterpriseTitle")}
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">{t("pricing.enterpriseSubtitle")}</p>
              <a href="mailto:enterprise@qliniqit.com"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.68 0.20 52))", color: "oklch(0.15 0.05 262)" }}>
                {t("pricing.enterpriseCta")} <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
