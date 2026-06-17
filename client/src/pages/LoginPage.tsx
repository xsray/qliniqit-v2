import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Search, CalendarCheck, Globe, Star,
  UserCircle2, Building2,
  Stethoscope, CalendarDays, Bot, FolderOpen, Users, BadgeCheck,
  CalendarRange, CreditCard, Video, BarChart3, ShieldCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { trpc } from "../lib/trpc";

type Mode = "login" | "role-select" | "signup" | "reset";
type Role = "user" | "provider";
type PerkIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>;

interface Perk {
  Icon: PerkIcon;
  title: string;
  desc: string;
}

// ── Login perks ──────────────────────────────────────────────────────────────

const LOGIN_PERKS_EN: Perk[] = [
  { Icon: Search,        title: "Find the right doctor",   desc: "Search 12,000+ verified providers by specialty, city, or language." },
  { Icon: CalendarCheck, title: "Book in minutes",          desc: "Choose your slot, confirm instantly — in-clinic or video." },
  { Icon: Globe,         title: "Global coverage",          desc: "Providers in 190+ countries. Book in your local currency." },
  { Icon: Star,          title: "Real reviews",             desc: "Verified reviews from confirmed members help you choose with confidence." },
];
const LOGIN_PERKS_AR: Perk[] = [
  { Icon: Search,        title: "ابحث عن الطبيب المناسب", desc: "ابحث في أكثر من 12,000 مزود موثّق حسب التخصص أو المدينة أو اللغة." },
  { Icon: CalendarCheck, title: "احجز في دقائق",           desc: "اختر موعدك، أكّده فوراً — في العيادة أو عبر الفيديو." },
  { Icon: Globe,         title: "تغطية عالمية",            desc: "مزودون في أكثر من 190 دولة. احجز بعملتك المحلية." },
  { Icon: Star,          title: "تقييمات حقيقية",          desc: "تقييمات موثّقة من مرضى حقيقيين تساعدك على الاختيار بثقة." },
];

// ── Member perks ─────────────────────────────────────────────────────────────

const MEMBER_PERKS_EN: Perk[] = [
  { Icon: Stethoscope,   title: "Discover verified doctors",  desc: "Filter 12,000+ specialists by specialty, city, language, and rating." },
  { Icon: CalendarCheck, title: "Instant booking",            desc: "Pick a slot and confirm in seconds — in-clinic or video consultation." },
  { Icon: Bot,           title: "AI Health Assistant",        desc: "Describe your symptoms and get guidance on which specialist to see." },
  { Icon: FolderOpen,    title: "Health Vault",               desc: "Store prescriptions, lab results, and medical records securely in one place." },
  { Icon: Users,         title: "Family profiles",            desc: "Manage health appointments for your whole family under one account." },
  { Icon: Star,          title: "Verified reviews",           desc: "Leave reviews after confirmed appointments to help other members." },
];
const MEMBER_PERKS_AR: Perk[] = [
  { Icon: Stethoscope,   title: "اكتشف أطباء موثّقين",       desc: "فلتر أكثر من 12,000 متخصص حسب التخصص والمدينة واللغة والتقييم." },
  { Icon: CalendarCheck, title: "حجز فوري",                   desc: "اختر موعدك وأكّده في ثوانٍ — عيادة أو فيديو." },
  { Icon: Bot,           title: "المساعد الصحي الذكي",        desc: "صف أعراضك واحصل على إرشاد حول أي متخصص تحتاج." },
  { Icon: FolderOpen,    title: "الملف الصحي",                desc: "احتفظ بالوصفات ونتائج المختبر والسجلات الطبية في مكان واحد." },
  { Icon: Users,         title: "ملفات العائلة",              desc: "أدر مواعيد عائلتك بأكملها من حساب واحد." },
  { Icon: Star,          title: "تقييمات موثّقة",             desc: "اترك تقييمات بعد المواعيد المؤكدة لمساعدة الأعضاء الآخرين." },
];

// ── Provider perks ───────────────────────────────────────────────────────────

const PROVIDER_PERKS_EN: Perk[] = [
  { Icon: Building2,    title: "Professional profile",    desc: "Showcase your specialty, qualifications, and fees to members worldwide." },
  { Icon: CalendarRange,title: "Smart scheduling",        desc: "Set your availability, manage in-clinic and video slots, and sync with Google Calendar." },
  { Icon: CreditCard,   title: "Easy payments",           desc: "Accept online payments in local currencies with transparent fee structures." },
  { Icon: Video,        title: "Health Reels",            desc: "Upload short health videos to build your brand and attract new members." },
  { Icon: BarChart3,    title: "Analytics dashboard",     desc: "Track bookings, views, revenue, and member reviews in real time." },
  { Icon: ShieldCheck,  title: "Verification badge",      desc: "Get verified to build trust and rank higher in search results." },
];
const PROVIDER_PERKS_AR: Perk[] = [
  { Icon: Building2,    title: "ملف احترافي",             desc: "اعرض تخصصك ومؤهلاتك ولغاتك ورسوم استشارتك للأعضاء حول العالم." },
  { Icon: CalendarRange,title: "جدولة ذكية",              desc: "حدد توافرك وأدر مواعيد العيادة والفيديو وزامن مع Google Calendar." },
  { Icon: CreditCard,   title: "مدفوعات سهلة",            desc: "اقبل المدفوعات الإلكترونية بالعملات المحلية بهياكل رسوم شفافة." },
  { Icon: Video,        title: "ريلز الصحة",              desc: "ارفع مقاطع صحية قصيرة لبناء علامتك التجارية وجذب أعضاء جدد." },
  { Icon: BarChart3,    title: "لوحة التحليلات",           desc: "تتبع الحجوزات والمشاهدات والإيرادات والتقييمات بشكل فوري." },
  { Icon: ShieldCheck,  title: "شارة التحقق",              desc: "احصل على التوثيق لبناء الثقة والظهور أعلى في نتائج البحث." },
];

// ── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({ mode, role, lang }: { mode: Mode; role: Role; lang: string }) {
  const isAr = lang === "ar";

  const perks =
    mode === "signup"
      ? role === "provider"
        ? isAr ? PROVIDER_PERKS_AR : PROVIDER_PERKS_EN
        : isAr ? MEMBER_PERKS_AR : MEMBER_PERKS_EN
      : isAr ? LOGIN_PERKS_AR : LOGIN_PERKS_EN;

  const headline =
    mode === "signup"
      ? role === "provider"
        ? isAr ? "انضم كمزود رعاية صحية" : "Join as a Healthcare Provider"
        : isAr ? "انضم كعضو" : "Join as a Member"
      : isAr ? "صحتك، عالمك." : "Your health,\nyour world.";

  const subheadline =
    mode === "signup"
      ? role === "provider"
        ? isAr ? "أدر عيادتك وتواصل مع الأعضاء في أي مكان." : "Manage your practice and connect with members anywhere in the world."
        : isAr ? "وصول كامل لأدوات الصحة الرقمية." : "Full access to all digital health tools."
      : isAr
        ? "انضم إلى آلاف الأعضاء الذين يديرون صحتهم مع Qliniqit."
        : "Join thousands of members managing their health with Qliniqit.";

  const isProvider = role === "provider" && mode === "signup";
  const gradient = isProvider
    ? "from-accent-800 via-accent-700 to-primary-700"
    : "from-primary-800 via-primary-700 to-accent-700";

  return (
    <div className={`hidden md:flex md:w-5/12 bg-gradient-to-br ${gradient} flex-col justify-between p-10 text-white`}>
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
        Qliniqit
      </Link>

      <div>
        {/* Role badge */}
        {mode === "signup" && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
            isProvider
              ? "bg-white/10 border-white/20 text-white/90"
              : "bg-white/10 border-white/20 text-white/90"
          }`}>
            {isProvider
              ? <Building2 className="w-3.5 h-3.5" strokeWidth={2} />
              : <UserCircle2 className="w-3.5 h-3.5" strokeWidth={2} />}
            {isProvider
              ? (isAr ? "حساب مزود" : "Provider Account")
              : (isAr ? "حساب عضو" : "Member Account")}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2 leading-snug whitespace-pre-line" style={{ fontFamily: "var(--font-heading)" }}>
          {headline}
        </h2>
        <p className="text-white/55 text-sm mb-8 leading-relaxed">{subheadline}</p>

        <ul className="space-y-5">
          {perks.map((p) => (
            <li key={p.title} className="flex items-start gap-3.5">
              <div className="w-8 h-8 bg-white/12 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                <p.Icon className="w-4 h-4 text-white/90" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-white/95 text-sm leading-none mb-1">{p.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
        <div className="flex -space-x-2">
          {["A", "S", "J", "F"].map((l, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-xs font-semibold text-white">
              {l}
            </div>
          ))}
        </div>
        <p className="text-white/50 text-xs">
          <span className="text-white font-semibold">500,000+</span>{" "}
          {isAr ? "استشارة مكتملة" : "consultations completed"}
        </p>
      </div>
    </div>
  );
}

// ── Role selection card ───────────────────────────────────────────────────────

function RoleCard({
  RoleIcon,
  title,
  description,
  perks,
  ctaLabel,
  accent,
  onSelect,
}: {
  RoleIcon: PerkIcon;
  title: string;
  description: string;
  perks: Perk[];
  ctaLabel: string;
  accent: "primary" | "accent";
  onSelect: () => void;
}) {
  const isPrimary = accent === "primary";

  return (
    <button
      onClick={onSelect}
      className={`group bg-white border-2 rounded-2xl p-7 text-left transition-all duration-200 hover:shadow-xl ${
        isPrimary
          ? "border-gray-100 hover:border-primary-300"
          : "border-gray-100 hover:border-accent-300"
      }`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
        isPrimary
          ? "bg-primary-50 group-hover:bg-primary-600"
          : "bg-accent-50 group-hover:bg-accent-600"
      }`}>
        <RoleIcon className={`w-6 h-6 transition-colors ${
          isPrimary
            ? "text-primary-600 group-hover:text-white"
            : "text-accent-600 group-hover:text-white"
        }`} strokeWidth={1.75} />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-bold text-gray-900 mb-1.5" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">{description}</p>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-7">
        {perks.map((p) => (
          <li key={p.title} className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              isPrimary ? "bg-primary-100" : "bg-accent-100"
            }`}>
              <p.Icon className={`w-2.5 h-2.5 ${isPrimary ? "text-primary-600" : "text-accent-600"}`} strokeWidth={2.5} />
            </div>
            <span>{p.title}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-colors ${
        isPrimary
          ? "bg-primary-600 text-white group-hover:bg-primary-700"
          : "bg-accent-600 text-white group-hover:bg-accent-700"
      }`}>
        {ctaLabel}
      </div>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const { supabase } = useAuth();
  const [, navigate] = useLocation();
  const upsertUser = trpc.auth.upsertUser.useMutation();
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  function resetForm() {
    setError(null);
    setMessage(null);
    setEmail("");
    setPassword("");
    setName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          await upsertUser.mutateAsync({ supabaseUid: data.user.id, email: data.user.email, name: data.user.user_metadata?.name });
          navigate(data.user.user_metadata?.role === "provider" ? "/provider-dashboard" : "/dashboard");
        }
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, role } } });
        if (error) throw error;
        if (data.user) {
          await upsertUser.mutateAsync({ supabaseUid: data.user.id, email: data.user.email, name });
          setMessage(isAr ? "تم إنشاء الحساب! تحقق من بريدك للتأكيد ثم سجّل دخولك." : "Account created! Check your email to confirm, then sign in.");
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage(isAr ? "تم إرسال رابط إعادة التعيين." : "Password reset email sent — check your inbox.");
      }
    } catch (err: any) {
      setError(err.message ?? t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  // ── Role selection ─────────────────────────────────────────────────────────
  if (mode === "role-select") {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-gray-50 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-primary-100">
              <BadgeCheck className="w-3.5 h-3.5" />
              {isAr ? "إنشاء حساب مجاني" : "Free to get started"}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {isAr ? "كيف ستستخدم Qliniqit؟" : "How will you use Qliniqit?"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isAr ? "اختر نوع حسابك — يمكنك دائماً التبديل لاحقاً." : "Choose your account type — you can always switch later."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <RoleCard
              RoleIcon={UserCircle2}
              title={isAr ? "عضو" : "Member"}
              description={isAr
                ? "ابحث عن الأطباء، احجز المواعيد، وأدر صحتك وصحة عائلتك."
                : "Search for doctors, book appointments, and manage your health and your family's."}
              perks={isAr ? MEMBER_PERKS_AR : MEMBER_PERKS_EN}
              ctaLabel={isAr ? "إنشاء حساب عضو" : "Create Member Account"}
              accent="primary"
              onSelect={() => { setRole("user"); setMode("signup"); resetForm(); }}
            />
            <RoleCard
              RoleIcon={Building2}
              title={isAr ? "مزود رعاية صحية" : "Healthcare Provider"}
              description={isAr
                ? "أدر عيادتك، استقبل مرضى من حول العالم، وطوّر ممارستك."
                : "Manage your practice, receive members globally, and grow your brand."}
              perks={isAr ? PROVIDER_PERKS_AR : PROVIDER_PERKS_EN}
              ctaLabel={isAr ? "إنشاء حساب مزود" : "Create Provider Account"}
              accent="accent"
              onSelect={() => { setRole("provider"); setMode("signup"); resetForm(); }}
            />
          </div>

          <p className="text-center text-sm text-gray-400">
            {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <button onClick={() => { setMode("login"); resetForm(); }} className="text-primary-600 font-semibold hover:underline">
              {isAr ? "تسجيل الدخول" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Auth form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-60px)] flex">
      <LeftPanel mode={mode} role={role} lang={lang} />

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <Link href="/" className="text-xl font-bold text-primary-600 block mb-8 md:hidden" style={{ fontFamily: "var(--font-heading)" }}>
            Qliniqit
          </Link>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            {/* Role badge + change link */}
            {mode === "signup" && (
              <div className="flex items-center justify-between mb-5">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  role === "provider"
                    ? "bg-accent-50 text-accent-700 border-accent-200"
                    : "bg-primary-50 text-primary-700 border-primary-200"
                }`}>
                  {role === "provider"
                    ? <Building2 className="w-3 h-3" strokeWidth={2} />
                    : <UserCircle2 className="w-3 h-3" strokeWidth={2} />}
                  {role === "provider"
                    ? (isAr ? "حساب مزود" : "Provider Account")
                    : (isAr ? "حساب عضو" : "Member Account")}
                </div>
                <button onClick={() => { setMode("role-select"); resetForm(); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  {isAr ? "تغيير ←" : "← Change"}
                </button>
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              {mode === "login" ? t("auth.welcomeBack")
                : mode === "signup"
                  ? role === "provider"
                    ? (isAr ? "إنشاء حساب مزود" : "Create Provider Account")
                    : t("auth.createAccount")
                  : t("auth.resetPassword")}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              {mode === "login" ? t("auth.signInSubtitle")
                : mode === "signup"
                  ? role === "provider"
                    ? (isAr ? "انضم كمزود وابدأ بالتواصل مع الأعضاء." : "Join as a provider and start connecting with members.")
                    : t("auth.signUpSubtitle")
                  : t("auth.resetSubtitle")}
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.fullName")}</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder={role === "provider" ? (isAr ? "د. أحمد الخالد" : "Dr. Jane Smith") : (isAr ? "أحمد محمد" : "Jane Smith")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow placeholder-gray-300" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.email")}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow placeholder-gray-300" />
              </div>
              {mode !== "reset" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("auth.password")}</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow" />
                  {mode === "signup" && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      {isAr ? "8 أحرف على الأقل، حرف كبير ورقم." : "Minimum 8 characters, 1 uppercase, 1 number."}
                    </p>
                  )}
                </div>
              )}

              {mode === "signup" && role === "provider" && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="provider-consent"
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="provider-consent" className="text-xs text-amber-800 leading-relaxed cursor-pointer">
                    I consent that my submitted qualifications are true and valid, and may be checked by the relevant authorization body. I understand that providing false information may result in permanent account suspension.
                  </label>
                </div>
              )}

              <button type="submit" disabled={loading || (mode === "signup" && role === "provider" && !consentChecked)}
                className={`w-full text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors text-sm mt-2 ${
                  mode === "signup" && role === "provider"
                    ? "bg-accent-600 hover:bg-accent-700"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}>
                {loading ? t("common.loading")
                  : mode === "login" ? t("auth.signIn")
                  : mode === "signup"
                    ? (role === "provider"
                      ? (isAr ? "إنشاء حساب المزود — مجاناً" : "Create Provider Account — Free")
                      : t("auth.createFree"))
                  : t("auth.sendReset")}
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-2 text-center text-sm">
              {mode === "login" && (
                <>
                  <button onClick={() => setMode("reset")} className="text-gray-400 hover:text-gray-600 transition-colors text-xs">
                    {t("auth.forgotPassword")}
                  </button>
                  <p className="text-gray-400 text-xs">
                    {t("auth.noAccount")}{" "}
                    <button onClick={() => { setMode("role-select"); resetForm(); }} className="text-primary-600 font-semibold hover:underline">
                      {t("auth.signUpFree")}
                    </button>
                  </p>
                </>
              )}
              {mode === "signup" && (
                <p className="text-gray-400 text-xs">
                  {t("auth.hasAccount")}{" "}
                  <button onClick={() => { setMode("login"); resetForm(); }} className="text-primary-600 font-semibold hover:underline">
                    {t("auth.signIn")}
                  </button>
                </p>
              )}
              {mode === "reset" && (
                <button onClick={() => setMode("login")} className="text-primary-600 font-semibold hover:underline text-xs">
                  {t("auth.backToSignIn")}
                </button>
              )}
            </div>
          </div>

          {(mode === "login" || mode === "signup") && (
            <p className="text-center text-xs text-gray-400 mt-5">
              {isAr ? "بالمتابعة توافق على" : "By continuing you agree to our"}{" "}
              <a href="#" className="underline hover:text-gray-600">{t("auth.termsLink")}</a>{" "}
              {t("auth.and")}{" "}
              <a href="#" className="underline hover:text-gray-600">{t("auth.privacyLink")}</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
