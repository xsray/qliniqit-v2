import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import {
  Heart, Microscope, SmilePlus, Baby, Bone, Brain, Eye, Flower2,
  Search, MapPin, Video, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight,
  Star, SlidersHorizontal, Clock, Navigation, LayoutList, Map, Loader2, X,
} from "lucide-react";

const P  = "oklch(0.47 0.22 262)";

const AVAILABILITY_HINTS = [
  "Available today",
  "Next: Tomorrow 9am",
  "Available today",
  "Next: Mon 2pm",
  "Available today",
  "Next: Tomorrow 11am",
];

type PerkIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>;
type SpecialtyChip = { label: string; value: string; Icon?: PerkIcon; grad?: string };

const SPECIALTY_CHIPS: SpecialtyChip[] = [
  { label: "All",           value: "" },
  { label: "Cardiology",    value: "cardio",   Icon: Heart,       grad: "linear-gradient(135deg, oklch(0.68 0.21 15), oklch(0.48 0.26 350))" },
  { label: "Dentistry",     value: "dental",   Icon: SmilePlus,   grad: "linear-gradient(135deg, oklch(0.65 0.17 175), oklch(0.46 0.19 155))" },
  { label: "Dermatology",   value: "derma",    Icon: Microscope,  grad: "linear-gradient(135deg, oklch(0.62 0.18 225), oklch(0.42 0.22 255))" },
  { label: "Pediatrics",    value: "pediatr",  Icon: Baby,        grad: "linear-gradient(135deg, oklch(0.76 0.17 65), oklch(0.62 0.22 40))" },
  { label: "Orthopedics",   value: "ortho",    Icon: Bone,        grad: "linear-gradient(135deg, oklch(0.70 0.18 45), oklch(0.52 0.22 25))" },
  { label: "Psychiatry",    value: "psych",    Icon: Brain,       grad: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" },
  { label: "Ophthalmology", value: "ophthal",  Icon: Eye,         grad: "linear-gradient(135deg, oklch(0.54 0.22 262), oklch(0.38 0.20 285))" },
  { label: "Gynecology",    value: "gynec",    Icon: Flower2,     grad: "linear-gradient(135deg, oklch(0.68 0.19 335), oklch(0.48 0.23 315))" },
];

const CARD_GRADS = [
  "linear-gradient(90deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))",
  "linear-gradient(90deg, oklch(0.54 0.24 290), oklch(0.68 0.19 335))",
  "linear-gradient(90deg, oklch(0.54 0.21 262), oklch(0.75 0.18 65))",
  "linear-gradient(90deg, oklch(0.65 0.17 175), oklch(0.47 0.22 262))",
  "linear-gradient(90deg, oklch(0.68 0.21 15), oklch(0.54 0.24 290))",
  "linear-gradient(90deg, oklch(0.76 0.17 65), oklch(0.47 0.22 262))",
];


export default function ProvidersPage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQ = params.get("q") ?? "";

  const [query, setQuery]               = useState(initialQ);
  const [city, setCity]                 = useState("");
  const [countryCode, setCountryCode]   = useState("");
  const [offersVideo, setOffersVideo]   = useState<boolean | undefined>(undefined);
  const [activeChip, setActiveChip]     = useState(initialQ);
  const [page, setPage]                 = useState(1);
  const [filtersOpen, setFiltersOpen]   = useState(false);

  // Geolocation state
  const [userLat, setUserLat]           = useState<number | null>(null);
  const [userLng, setUserLng]           = useState<number | null>(null);
  const [locating, setLocating]         = useState(false);
  const [locError, setLocError]         = useState<string | null>(null);

  // View mode: list | map | split (split only on desktop)
  const [view, setView]                 = useState<"list" | "map">("list");

  useEffect(() => {
    if (initialQ) { setQuery(initialQ); setActiveChip(initialQ); }
  }, []);

  const { data, isLoading, isError } = trpc.providers.search.useQuery({
    query: query || undefined,
    city: city || undefined,
    countryCode: countryCode || undefined,
    offersVideo,
    page,
    limit: 12,
  });

  function handleChip(value: string) {
    setActiveChip(value);
    setQuery(value);
    setPage(1);
  }

  // ── Geolocation ──────────────────────────────────────────────────────────────
  async function handleLocate() {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by your browser");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLat(lat);
        setUserLng(lng);
        try {
          // Nominatim reverse geocoding (free, no key required)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const json = await res.json() as { address?: Record<string, string> };
          const detectedCity =
            json.address?.city ||
            json.address?.town ||
            json.address?.village ||
            json.address?.county ||
            "";
          if (detectedCity) {
            setCity(detectedCity);
            setPage(1);
          }
        } catch {
          // coords still set even if city name fails
        }
        setLocating(false);
      },
      (err) => {
        setLocError(
          err.code === 1
            ? "Location access denied — please allow it in your browser"
            : "Could not detect your location"
        );
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 60_000 }
    );
  }

  // ── Map embed URL — OpenStreetMap (free, no key required) ───────────────────
  function buildMapSrc(): string {
    const specialty = SPECIALTY_CHIPS.find(c => c.value === activeChip && c.value !== "");
    const searchTerm = specialty ? specialty.label : (query || "healthcare");

    if (userLat !== null && userLng !== null) {
      // User location known — centre on them, zoom in
      const bbox = 0.08;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${userLng - bbox},${userLat - bbox},${userLng + bbox},${userLat + bbox}&layer=mapnik&marker=${userLat},${userLng}`;
    }
    if (city) {
      return `https://www.openstreetmap.org/export/embed.html?query=${encodeURIComponent(searchTerm + " " + city)}&layer=mapnik`;
    }
    // Generic world view
    return `https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik`;
  }

  // Deep-link to Google Maps for a specific provider card
  function providerMapUrl(p: { name?: string | null; city?: string | null; countryCode?: string | null }) {
    const parts = [p.name, p.city, p.countryCode].filter(Boolean).join(" ");
    return `https://www.google.com/maps/search/${encodeURIComponent(parts)}`;
  }

  const mapSrc = buildMapSrc();
  const activeSpecialty = SPECIALTY_CHIPS.find(c => c.value === activeChip && c.value !== "");
  const showMap = view === "map" || view === "list"; // always show in split on desktop

  return (
    <div>
      {/* ── Hero header ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-14 px-6"
        style={{ background: "linear-gradient(145deg, oklch(0.22 0.18 262) 0%, oklch(0.32 0.22 262) 50%, oklch(0.36 0.24 285) 100%)" }}
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.54 0.24 290 / 0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                {activeSpecialty ? activeSpecialty.label : "All Specialties"}
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Discover Care
              </h1>
              <p className="text-white/50 mt-2 text-sm">Video consult or in-clinic — 12,000+ verified providers worldwide</p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 self-start sm:self-center">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-white/60 hover:text-white"}`}
              >
                <LayoutList className="w-3.5 h-3.5" strokeWidth={2}/> List
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${view === "map" ? "bg-white text-gray-900 shadow-sm" : "text-white/60 hover:text-white"}`}
              >
                <Map className="w-3.5 h-3.5" strokeWidth={2}/> Map
              </button>
            </div>
          </div>

          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Keyword */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search by name, specialty, or condition…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveChip(""); setPage(1); }}
                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 shadow-lg placeholder-gray-400 bg-white"
                style={{ "--tw-ring-color": "oklch(0.64 0.18 262 / 0.4)" } as React.CSSProperties}
              />
            </div>

            {/* City + locate */}
            <div className="flex gap-2">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="City…"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setUserLat(null); setUserLng(null); setPage(1); }}
                  className="w-full sm:w-40 pl-10 pr-8 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none shadow-lg placeholder-gray-400 bg-white"
                />
                {city && (
                  <button onClick={() => { setCity(""); setUserLat(null); setUserLng(null); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" strokeWidth={2.5}/>
                  </button>
                )}
              </div>

              {/* Geolocation button */}
              <button
                onClick={handleLocate}
                disabled={locating}
                title="Use my location"
                className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold shadow-lg transition-all whitespace-nowrap ${
                  userLat !== null
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {locating
                  ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2}/>
                  : <Navigation className={`w-4 h-4 ${userLat !== null ? "fill-white" : ""}`} strokeWidth={2}/>
                }
                <span className="hidden sm:inline">{userLat !== null ? "Located" : "Near me"}</span>
              </button>
            </div>

            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold shadow-lg transition-all ${
                filtersOpen ? "bg-white text-primary-700" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Filters
            </button>
          </div>

          {/* Telemedicine quick-filter bar */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <button
              onClick={() => { setOffersVideo(true); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                offersVideo === true
                  ? "bg-white text-primary-700 border-white shadow-lg"
                  : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              }`}
            >
              <Video className="w-3.5 h-3.5" strokeWidth={2} />
              Video Consult Available
            </button>
            <button
              onClick={() => { setOffersVideo(undefined); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                offersVideo === undefined
                  ? "bg-white text-primary-700 border-white shadow-lg"
                  : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              }`}
            >
              All Providers
            </button>
            <span className="text-white/30 text-xs ml-2 hidden sm:inline">
              · Teleconsult from anywhere, anytime
            </span>
          </div>

          {/* Location error */}
          {locError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-900/30 border border-amber-700/30 rounded-xl px-4 py-2.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2}/>
              {locError}
              <button onClick={() => setLocError(null)} className="ml-auto text-amber-400 hover:text-white"><X className="w-3.5 h-3.5" strokeWidth={2}/></button>
            </div>
          )}

          {/* Filter dropdown */}
          {filtersOpen && (
            <div className="mt-3 bg-white rounded-2xl p-5 shadow-xl flex flex-wrap gap-6 items-start">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Appointment type</label>
                <div className="flex gap-2">
                  {[
                    { label: "All types", value: "" },
                    { label: "📹 Video / Teleconsult", value: "true" },
                    { label: "In-clinic", value: "false" },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => { setOffersVideo(opt.value === "" ? undefined : opt.value === "true"); setPage(1); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        (offersVideo === undefined && opt.value === "") || (offersVideo !== undefined && String(offersVideo) === opt.value)
                          ? "bg-primary-600 text-white border-primary-600"
                          : "border-gray-200 text-gray-600 hover:border-primary-300"
                      }`}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Country</label>
                <select
                  value={countryCode}
                  onChange={e => { setCountryCode(e.target.value); setPage(1); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 focus:outline-none focus:border-primary-400 bg-white min-w-[180px]"
                >
                  <option value="">All countries</option>
                  <option value="AE">🇦🇪 UAE</option>
                  <option value="SA">🇸🇦 Saudi Arabia</option>
                  <option value="JO">🇯🇴 Jordan</option>
                  <option value="EG">🇪🇬 Egypt</option>
                  <option value="KW">🇰🇼 Kuwait</option>
                  <option value="QA">🇶🇦 Qatar</option>
                  <option value="BH">🇧🇭 Bahrain</option>
                  <option value="OM">🇴🇲 Oman</option>
                  <option value="LB">🇱🇧 Lebanon</option>
                  <option value="IQ">🇮🇶 Iraq</option>
                  <option value="TR">🇹🇷 Turkey</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="GB">🇬🇧 UK</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="US">🇺🇸 USA</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="IN">🇮🇳 India</option>
                  <option value="PK">🇵🇰 Pakistan</option>
                  <option value="TH">🇹🇭 Thailand</option>
                  <option value="SG">🇸🇬 Singapore</option>
                  <option value="MY">🇲🇾 Malaysia</option>
                  <option value="NG">🇳🇬 Nigeria</option>
                  <option value="ZA">🇿🇦 South Africa</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Specialty chips ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {SPECIALTY_CHIPS.map((c) => {
              const isActive = activeChip === c.value;
              return (
                <button key={c.value} onClick={() => handleChip(c.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    isActive ? "text-white border-transparent shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600"
                  }`}
                  style={isActive ? { background: c.grad ?? "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" } : {}}
                >
                  {c.Icon && <c.Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400"}`} strokeWidth={2} />}
                  {c.label}
                </button>
              );
            })}
            {data && (
              <span className="ml-auto flex-shrink-0 flex items-center text-xs text-gray-400 font-medium px-3">
                {data.providers.length === 12 ? "12+" : data.providers.length} results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content: list + map ─────────────────────────────── */}
      <div className={`max-w-[1400px] mx-auto px-4 py-6 ${view === "map" ? "" : "md:grid md:grid-cols-[1fr,420px] md:gap-6 md:items-start"}`}>

        {/* ── Provider list ─────────────────────────────────────── */}
        {view !== "map" && (
          <main className="min-h-[60vh]" style={{ background: "transparent" }}>
            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-1 bg-gray-100" />
                    <div className="p-5 animate-pulse">
                      <div className="flex gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0" />
                        <div className="flex-1"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/><div className="h-3 bg-gray-100 rounded w-1/2"/></div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-2"/><div className="h-3 bg-gray-100 rounded w-2/3"/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-9 h-9 text-red-400" strokeWidth={1.5} />
                </div>
                <p className="text-red-500 font-bold text-lg">Failed to load providers</p>
                <p className="text-gray-400 text-sm mt-2">Check your connection and try again</p>
              </div>
            )}

            {!isLoading && data && data.providers.length === 0 && (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, oklch(0.97 0.02 262), oklch(0.93 0.05 262))" }}>
                  <Search className="w-9 h-9" style={{ color: "oklch(0.64 0.18 262)" }} strokeWidth={1.5} />
                </div>
                <p className="text-gray-800 font-bold text-xl">No providers found</p>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">Try adjusting your filters or searching for a different specialty</p>
                <button onClick={() => { setQuery(""); setCity(""); setCountryCode(""); setOffersVideo(undefined); setActiveChip(""); setPage(1); setUserLat(null); setUserLng(null); }}
                  className="mt-6 font-semibold text-sm px-6 py-2.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
                  Clear all filters
                </button>
              </div>
            )}

            {!isLoading && data && data.providers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.providers.map((p, idx) => {
                  const grad = CARD_GRADS[idx % CARD_GRADS.length]!;
                  const avail = AVAILABILITY_HINTS[idx % AVAILABILITY_HINTS.length]!;
                  const availToday = avail === "Available today";
                  return (
                    <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100/80 flex flex-col">
                      <div className="h-1" style={{ background: grad }} />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start gap-3 mb-4">
                          {p.avatarUrl
                            ? <img src={p.avatarUrl} alt={p.name ?? ""} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 ring-2 ring-gray-100"/>
                            : <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white flex-shrink-0 shadow-md" style={{ background: grad }}>{(p.name ?? "?")[0]}</div>
                          }
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold text-gray-900 text-sm leading-snug truncate">{p.name}</p>
                              {p.verificationStatus === "verified" && (
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2}/>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{p.specialtyName ?? p.providerType?.replace(/_/g, " ")}</p>

                            {/* Location — links to Google Maps */}
                            <a
                              href={providerMapUrl(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs mt-1 hover:underline"
                              style={{ color: P }}
                            >
                              <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={2}/>
                              {p.city}{p.countryCode ? `, ${p.countryCode}` : ""}
                            </a>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-3 self-start ${
                          availToday ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                        }`}>
                          {availToday ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>{avail}</> : <><Clock className="w-3 h-3" strokeWidth={2}/>{avail}</>}
                        </span>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                          <div>
                            <p className="font-bold text-sm" style={{ color: P }}>
                              {p.consultationFee ? `${p.currencyCode ?? "USD"} ${p.consultationFee}` : "Fee on request"}
                            </p>
                            {p.ratingAvg && (
                              <p className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" strokeWidth={1}/>
                                {Number(p.ratingAvg).toFixed(1)}
                                <span className="text-gray-400 font-normal">({p.reviewCount})</span>
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            {p.offersVideo && (
                              <Link href={`/providers/${p.slug}`}
                                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white animate-pulse"
                                style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
                                <Video className="w-3 h-3" strokeWidth={2}/> Teleconsult
                              </Link>
                            )}
                            <Link href={`/providers/${p.slug}`}
                              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                              style={{ background: grad }}>
                              {p.offersVideo ? "Book" : "Book"} <ChevronRight className="w-3 h-3" strokeWidth={2.5}/>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {data && (data.providers.length === 12 || page > 1) && (
              <div className="flex justify-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-all">
                  <ChevronLeft className="w-4 h-4" strokeWidth={2}/> Previous
                </button>
                <span className="flex items-center px-6 py-3 text-sm font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-xl">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={data.providers.length < 12}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-all">
                  Next <ChevronRight className="w-4 h-4" strokeWidth={2}/>
                </button>
              </div>
            )}
          </main>
        )}

        {/* ── Google Map panel ──────────────────────────────────── */}
        {(view === "map" || view === "list") && (
          <div className={`${view === "map" ? "h-[calc(100vh-160px)] min-h-[500px]" : "hidden md:block md:sticky md:top-[120px] md:h-[calc(100vh-180px)] md:min-h-[500px]"} rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative`}>
            <iframe
              key={mapSrc}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              title="Provider locations map"
            />
            {/* Open in Google Maps deep link — always visible */}
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent((activeSpecialty?.label ?? query ?? "healthcare providers") + (city ? ` in ${city}` : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}
            >
              <Map className="w-3.5 h-3.5" strokeWidth={2}/>
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
