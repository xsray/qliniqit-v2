import { useState } from "react";
import { Link } from "wouter";
import {
  Plane, MapPin, Clock, Star, CheckCircle2, ChevronRight,
  Stethoscope, Hotel, Car, Camera, Shield, Globe, Filter, X,
  Heart, Smile, Eye, Bone, Brain, Baby
} from "lucide-react";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";
const G  = "oklch(0.75 0.18 65)";

// ── Mock data ──────────────────────────────────────────────────────────────

const DESTINATIONS = ["All", "Turkey", "Jordan", "Thailand", "Germany", "UAE", "India", "Spain"];
const TREATMENTS   = ["All", "Dental", "Cosmetic Surgery", "Cardiology", "Orthopedics", "Eye Surgery", "Fertility", "Oncology"];

interface Package {
  id: number;
  title: string;
  organizer: string;
  destination: string;
  city: string;
  flag: string;
  treatment: string;
  TreatmentIcon: React.ElementType;
  duration: string;
  price: number;
  currency: string;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  inclusions: string[];
  highlights: string[];
  badge?: string;
  badgeColor?: string;
}

const PACKAGES: Package[] = [
  {
    id: 1,
    title: "Complete Dental Restoration — Istanbul",
    organizer: "MediTravel Turkey",
    destination: "Turkey",
    city: "Istanbul",
    flag: "🇹🇷",
    treatment: "Dental",
    TreatmentIcon: Smile,
    duration: "7 days",
    price: 1890,
    currency: "USD",
    originalPrice: 3200,
    rating: 4.9,
    reviewCount: 214,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    inclusions: ["Round-trip flights", "4★ hotel (6 nights)", "Airport transfers", "Full dental treatment", "Follow-up consultation"],
    highlights: ["Save up to 70% vs UK/US prices", "JCI-accredited clinic", "Multilingual coordinator"],
    badge: "Best Seller",
    badgeColor: G,
  },
  {
    id: 2,
    title: "Hair Transplant & Recovery — Amman",
    organizer: "Qliniq Health Tours",
    destination: "Jordan",
    city: "Amman",
    flag: "🇯🇴",
    treatment: "Cosmetic Surgery",
    TreatmentIcon: Heart,
    duration: "5 days",
    price: 2100,
    currency: "USD",
    rating: 4.8,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
    inclusions: ["5★ hotel (4 nights)", "Airport VIP transfer", "FUE hair transplant", "PRP session", "Nurse aftercare kit"],
    highlights: ["Board-certified surgeons", "Concierge service", "Optional city tour"],
    badge: "Local Partner",
    badgeColor: P,
  },
  {
    id: 3,
    title: "Laser Eye Correction — Bangkok",
    organizer: "Asia Wellness Routes",
    destination: "Thailand",
    city: "Bangkok",
    flag: "🇹🇭",
    treatment: "Eye Surgery",
    TreatmentIcon: Eye,
    duration: "4 days",
    price: 1450,
    currency: "USD",
    originalPrice: 2100,
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    inclusions: ["Hotel (3 nights)", "Airport transfer", "LASIK both eyes", "Post-op drops kit", "1-year follow-up online"],
    highlights: ["LASIK & SMILE options", "FDA-approved lasers", "Lifetime enhancement guarantee"],
  },
  {
    id: 4,
    title: "Knee Replacement — Munich",
    organizer: "EuroMed Concierge",
    destination: "Germany",
    city: "Munich",
    flag: "🇩🇪",
    treatment: "Orthopedics",
    TreatmentIcon: Bone,
    duration: "14 days",
    price: 9800,
    currency: "USD",
    rating: 5.0,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    inclusions: ["Business-class flights", "Private hospital room", "Physiotherapy (10 sessions)", "Interpreter", "Post-op rehab plan"],
    highlights: ["Germany's top ortho surgeons", "Robotic knee system", "Full medical report in English"],
    badge: "Premium",
    badgeColor: A,
  },
  {
    id: 5,
    title: "IVF Fertility Package — Dubai",
    organizer: "Gulf Health Tourism",
    destination: "UAE",
    city: "Dubai",
    flag: "🇦🇪",
    treatment: "Fertility",
    TreatmentIcon: Baby,
    duration: "21 days",
    price: 5500,
    currency: "USD",
    rating: 4.6,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    inclusions: ["Apartment stay", "Full IVF cycle", "Hormone monitoring", "Embryologist consultation", "Legal support"],
    highlights: ["70%+ success rate", "Fully licensed clinic", "Arabic & English support"],
  },
  {
    id: 6,
    title: "Cardiac Check & Angioplasty — Chennai",
    organizer: "IndiaCure Health",
    destination: "India",
    city: "Chennai",
    flag: "🇮🇳",
    treatment: "Cardiology",
    TreatmentIcon: Heart,
    duration: "10 days",
    price: 4200,
    currency: "USD",
    originalPrice: 18000,
    rating: 4.8,
    reviewCount: 103,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    inclusions: ["Hotel near hospital", "Cardiac work-up", "Angioplasty procedure", "Stent (if required)", "Post-op monitoring"],
    highlights: ["NABH & JCI accredited", "Cardiologist with 20+ yrs exp", "Save 85% vs Western costs"],
    badge: "High Savings",
    badgeColor: "oklch(0.55 0.18 145)",
  },
];

// ── Stat bar ───────────────────────────────────────────────────────────────
const STATS = [
  { value: "40+", label: "Destinations" },
  { value: "120+", label: "Verified Organizers" },
  { value: "8,000+", label: "Members Served" },
  { value: "4.8★", label: "Average Rating" },
];

// ── Package card ───────────────────────────────────────────────────────────
function PackageCard({ pkg }: { pkg: Package }) {
  const [expanded, setExpanded] = useState(false);
  const savings = pkg.originalPrice ? Math.round((1 - pkg.price / pkg.originalPrice) * 100) : null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col"
      style={{ boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)" }}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img src={pkg.image} alt={pkg.city} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-xl">{pkg.flag}</span>
          <span className="text-white font-bold text-sm">{pkg.city}</span>
        </div>
        {pkg.badge && (
          <div className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: pkg.badgeColor }}>
            {pkg.badge}
          </div>
        )}
        {savings && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            −{savings}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Treatment chip */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <pkg.TreatmentIcon className="w-3.5 h-3.5" style={{ color: P }} strokeWidth={2} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: P }}>{pkg.treatment}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
            {pkg.duration}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">{pkg.title}</h3>
        <p className="text-xs text-gray-400 mb-3">by {pkg.organizer}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
          <span className="text-sm font-bold text-gray-800">{pkg.rating}</span>
          <span className="text-xs text-gray-400">({pkg.reviewCount} reviews)</span>
        </div>

        {/* Inclusions */}
        <div className={`space-y-1.5 mb-4 overflow-hidden transition-all duration-300 ${expanded ? "" : "max-h-[72px]"}`}>
          {pkg.inclusions.map((inc) => (
            <div key={inc} className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              {inc}
            </div>
          ))}
        </div>
        {pkg.inclusions.length > 3 && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold mb-4 text-left"
            style={{ color: P }}>
            {expanded ? "Show less" : `+${pkg.inclusions.length - 3} more included`}
          </button>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            {pkg.originalPrice && (
              <p className="text-xs text-gray-400 line-through">${pkg.originalPrice.toLocaleString()}</p>
            )}
            <p className="text-xl font-extrabold text-gray-900">
              ${pkg.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-400"> / person</span>
            </p>
          </div>
          <Link href="/login"
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${P}, ${A})` }}>
            Book now <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function TravelPackagesPage() {
  const [destination, setDestination] = useState("All");
  const [treatment, setTreatment] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = PACKAGES.filter((p) => {
    if (destination !== "All" && p.destination !== destination) return false;
    if (treatment !== "All" && p.treatment !== treatment) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;
    return true;
  });

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative text-white py-16 px-6 overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${PD} 0%, ${P} 55%, ${A} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass text-white/70 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <Plane className="w-3.5 h-3.5" strokeWidth={2} /> Health Tourism Packages
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            World-Class Care.<br />Seamless Travel.
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            All-inclusive medical travel packages — flights, hotel, treatment, and a dedicated coordinator. One price. Zero stress.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why health travel ──────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Shield, title: "Verified Organizers", desc: "Every partner is vetted and reviewed" },
            { Icon: Stethoscope, title: "Accredited Clinics", desc: "JCI & local health-authority certified" },
            { Icon: Hotel, title: "Stays Included", desc: "Hotel or serviced apartment near the clinic" },
            { Icon: Globe, title: "40+ Destinations", desc: "Europe, Middle East, Asia & beyond" },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.95 0.04 262)" }}>
                <Icon className="w-4.5 h-4.5" style={{ color: P }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-10 bg-white border-b border-gray-100 px-6 py-3"
        style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          {/* Destination chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 flex-1 min-w-0">
            {DESTINATIONS.map((d) => (
              <button key={d} onClick={() => setDestination(d)}
                className={`flex-shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                  destination === d
                    ? "text-white border-transparent"
                    : "text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={destination === d ? { background: P } : {}}>
                {d}
              </button>
            ))}
          </div>
          {/* Filter button */}
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex-shrink-0 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
              filtersOpen || treatment !== "All" || maxPrice !== null
                ? "text-white border-transparent"
                : "text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            style={filtersOpen || treatment !== "All" || maxPrice !== null ? { background: P } : {}}>
            <Filter className="w-3.5 h-3.5" strokeWidth={2} />
            Filters
            {(treatment !== "All" || maxPrice !== null) && (
              <span className="bg-white/30 rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {(treatment !== "All" ? 1 : 0) + (maxPrice !== null ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Treatment type</p>
              <div className="flex flex-wrap gap-2">
                {TREATMENTS.map((t) => (
                  <button key={t} onClick={() => setTreatment(t)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      treatment === t ? "text-white border-transparent" : "text-gray-600 border-gray-200"
                    }`}
                    style={treatment === t ? { background: A } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Max budget (USD)</p>
              <div className="flex gap-2">
                {[2000, 5000, 10000].map((v) => (
                  <button key={v} onClick={() => setMaxPrice(maxPrice === v ? null : v)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      maxPrice === v ? "text-white border-transparent" : "text-gray-600 border-gray-200"
                    }`}
                    style={maxPrice === v ? { background: P } : {}}>
                    ≤${v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            {(treatment !== "All" || maxPrice !== null) && (
              <button onClick={() => { setTreatment("All"); setMaxPrice(null); }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors ml-auto">
                <X className="w-3.5 h-3.5" strokeWidth={2} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Package grid ──────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-gray-400" strokeWidth={1.75} />
            </div>
            <p className="text-gray-700 font-semibold text-lg">No packages match your filters</p>
            <p className="text-gray-400 text-sm mt-2 mb-6">Try removing a filter or broadening your search</p>
            <button onClick={() => { setDestination("All"); setTreatment("All"); setMaxPrice(null); }}
              className="text-sm font-semibold hover:underline" style={{ color: P }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">{filtered.length} package{filtered.length !== 1 ? "s" : ""} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          </>
        )}

        {/* ── List your package CTA ──────────────────────────────────── */}
        <div className="mt-16 rounded-3xl p-8 text-center text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PD}, ${A})` }}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Are you a Health Tourism Organizer?</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              List Your Package on Qliniqit
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
              Reach thousands of international members actively searching for medical travel. No upfront cost.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/pricing"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ color: P }}>
                See organizer plans <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center gap-2 glass text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
