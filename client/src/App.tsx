import { useState } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import { useAuth } from "./hooks/useAuth";
import { useLanguage } from "./context/LanguageContext";
import NotificationsBell from "./components/NotificationsBell";
import Logo from "./components/Logo";
import { Menu, X, Stethoscope, CalendarDays, Sparkles, Tag, LayoutDashboard, Home } from "lucide-react";
import HomePage from "./pages/HomePage";
import ProvidersPage from "./pages/ProvidersPage";
import ProviderDetailPage from "./pages/ProviderDetailPage";
import DealsPage from "./pages/DealsPage";
import DashboardPage from "./pages/DashboardPage";
import ProviderDashboardPage from "./pages/ProviderDashboardPage";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import AiAssistantPage from "./pages/AiAssistantPage";
import ReelsPage from "./pages/ReelsPage";
import PricingPage from "./pages/PricingPage";
import TravelPackagesPage from "./pages/TravelPackagesPage";
import NotFound from "./pages/NotFound";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [location] = useLocation();
  const active = location === href || (href !== "/" && location.startsWith(href));
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active
          ? "text-primary-600 font-semibold"
          : "text-gray-600 hover:text-primary-600"
      }`}
    >
      {children}
    </Link>
  );
}

function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="text-xs font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
      title="Switch language"
    >
      {lang === "en" ? "عر" : "EN"}
    </button>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <Logo size={30} full white />
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              The global healthcare marketplace. Find, book, and consult with verified providers worldwide.
            </p>
            <div className="flex gap-4 mt-5 text-lg">
              <a href="#" className="hover:text-white transition-colors">𝕏</a>
              <a href="#" className="hover:text-white transition-colors">in</a>
              <a href="#" className="hover:text-white transition-colors">f</a>
            </div>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">For Members</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/providers" className="hover:text-white transition-colors">Find a Doctor</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Healthcare Deals</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events & Conferences</Link></li>
              <li><Link href="/travel" className="hover:text-white transition-colors">Health Travel</Link></li>
              <li><Link href="/reels" className="hover:text-white transition-colors">Health Reels</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-white transition-colors">AI Assistant</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Appointments</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign Up Free</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">For Providers</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/provider-dashboard" className="hover:text-white transition-colors">Provider Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">List Your Practice</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Verification Program</a></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Qliniqit. All rights reserved.</p>
          <div className="flex gap-1 items-center">
            <span className="text-green-500">●</span>
            <span>{t("common.systemsOk")}</span>
          </div>
          <p>{t("common.countries")}</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath] = useLocation();

  // Close mobile menu on route change
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/96 backdrop-blur-xl border-b border-gray-100 px-6 flex items-center gap-5 sticky top-0 z-20" style={{ height: 60, boxShadow: "0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.06)" }}>
        <Link href="/" onClick={closeMobile} className="flex-shrink-0 mr-2">
          <Logo size={32} full />
        </Link>

        {/* Nav links — hidden on small screens */}
        <div className="hidden md:flex items-center gap-5">
          <NavLink href="/providers">{t("nav.findDoctor")}</NavLink>
          <NavLink href="/deals">{t("nav.deals")}</NavLink>
          <NavLink href="/events">{t("nav.events")}</NavLink>
          <NavLink href="/reels">{t("nav.reels")}</NavLink>
          <NavLink href="/ai-assistant">{t("nav.aiAssistant")}</NavLink>
          <NavLink href="/travel">Health Travel</NavLink>
          <NavLink href="/pricing">For Providers</NavLink>
          {user && (
            <>
              <NavLink href="/dashboard">{t("nav.dashboard")}</NavLink>
              <NavLink href="/provider-dashboard">{t("nav.forProviders")}</NavLink>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <LangToggle />

          {!loading && (
            user ? (
              <>
                <NotificationsBell />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
                  {((user.email ?? "?")[0] ?? "?").toUpperCase()}
                </div>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors hidden sm:block"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium hidden sm:block">
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-white px-4 py-2 rounded-lg font-semibold hidden sm:block hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-10 top-[60px]">
          <div className="absolute inset-0 bg-black/20" onClick={closeMobile} />
          <div className="relative bg-white border-b border-gray-200 shadow-lg px-6 py-5 flex flex-col gap-1">
            {[
              { href: "/providers", label: t("nav.findDoctor") },
              { href: "/deals", label: t("nav.deals") },
              { href: "/events", label: t("nav.events") },
              { href: "/reels", label: t("nav.reels") },
              { href: "/ai-assistant", label: t("nav.aiAssistant") },
              { href: "/travel", label: "Health Travel" },
              ...(user ? [
                { href: "/dashboard", label: t("nav.dashboard") },
                { href: "/provider-dashboard", label: t("nav.forProviders") },
              ] : []),
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  currentPath === href || (href !== "/" && currentPath.startsWith(href))
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3">
              {user ? (
                <button
                  onClick={() => { signOut(); closeMobile(); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {t("nav.signOut")}
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" onClick={closeMobile} className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {t("nav.signIn")}
                  </Link>
                  <Link href="/login" onClick={closeMobile} className="flex-1 text-center py-3 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
                    {t("nav.getStarted")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      <div className="flex-1 pb-16 md:pb-0">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/providers" component={ProvidersPage} />
          <Route path="/providers/:slug" component={ProviderDetailPage} />
          <Route path="/deals" component={DealsPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/provider-dashboard" component={ProviderDashboardPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/ai-assistant" component={AiAssistantPage} />
          <Route path="/reels" component={ReelsPage} />
          <Route path="/travel" component={TravelPackagesPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/login" component={LoginPage} />
          <Route component={NotFound} />
        </Switch>
      </div>

      <Footer />

      {/* ── Mobile bottom nav ─────────────────────────────────────── */}
      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const P = "oklch(0.47 0.22 262)";

  const tabs = [
    { href: "/",            Icon: Home,         label: "Home"    },
    { href: "/providers",   Icon: Stethoscope,  label: "Doctors" },
    { href: "/ai-assistant",Icon: Sparkles,     label: "AI"      },
    { href: "/events",      Icon: CalendarDays, label: "Events"  },
    { href: user ? "/dashboard" : "/deals", Icon: user ? LayoutDashboard : Tag, label: user ? "Dashboard" : "Deals" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-100"
      style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(({ href, Icon, label }) => {
        const active = location === href || (href !== "/" && location.startsWith(href));
        return (
          <Link key={href} href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={{ color: active ? P : "#9CA3AF" }}>
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold">{label}</span>
            {active && (
              <span className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ background: P }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
