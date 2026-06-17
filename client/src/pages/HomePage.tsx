import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, ArrowRight, ArrowUpRight, ShieldCheck, Video, MapPin,
  CalendarDays, Star, CheckCircle2, Play,
  Heart, Fingerprint, SmilePlus, Baby, Bone, Eye, Brain, Dna,
  Stethoscope, Clapperboard, Sparkles, Tag, Building2, Bot,
  Clock, Zap, Globe2, ChevronRight, Ticket,
  Pill, FlaskConical, Package, Repeat2, Plane, MessageCircle,
  Users, TrendingUp,
} from "lucide-react";
import { trpc } from "../lib/trpc";
import { useLanguage } from "../context/LanguageContext";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";
const G  = "oklch(0.75 0.18 65)";

// ── Data ───────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { label:"Cardiology",    Icon:Heart,       query:"cardio",  grad:"linear-gradient(150deg,oklch(0.28 0.20 350) 0%,oklch(0.42 0.26 10) 55%,oklch(0.34 0.22 340) 100%)",  glow:"oklch(0.62 0.28 8)",   pattern:"radial", count:"1,240+", avgFee:"$60–$140", tagline:"Heart & vascular care" },
  { label:"Dermatology",   Icon:Fingerprint, query:"derma",   grad:"linear-gradient(150deg,oklch(0.24 0.18 245) 0%,oklch(0.38 0.22 232) 55%,oklch(0.30 0.16 210) 100%)", glow:"oklch(0.58 0.20 230)", pattern:"hex",    count:"980+",   avgFee:"$50–$120", tagline:"Skin, hair & nails" },
  { label:"Dentistry",     Icon:SmilePlus,   query:"dental",  grad:"linear-gradient(150deg,oklch(0.26 0.16 200) 0%,oklch(0.38 0.20 172) 55%,oklch(0.30 0.14 158) 100%)", glow:"oklch(0.56 0.22 170)", pattern:"dots",   count:"2,100+", avgFee:"$40–$200", tagline:"General & cosmetic dental" },
  { label:"Pediatrics",    Icon:Baby,        query:"pediatr", grad:"linear-gradient(150deg,oklch(0.28 0.18 36) 0%,oklch(0.44 0.22 46) 55%,oklch(0.34 0.20 28) 100%)",    glow:"oklch(0.64 0.24 44)",  pattern:"dots",   count:"1,560+", avgFee:"$45–$110", tagline:"Child & infant health" },
  { label:"Orthopedics",   Icon:Bone,        query:"ortho",   grad:"linear-gradient(150deg,oklch(0.24 0.10 240) 0%,oklch(0.36 0.16 228) 55%,oklch(0.28 0.12 218) 100%)", glow:"oklch(0.52 0.16 228)", pattern:"grid",   count:"740+",   avgFee:"$70–$160", tagline:"Bones, joints & spine" },
  { label:"Ophthalmology", Icon:Eye,         query:"ophthal", grad:"linear-gradient(150deg,oklch(0.26 0.22 282) 0%,oklch(0.42 0.28 298) 55%,oklch(0.32 0.24 312) 100%)", glow:"oklch(0.62 0.28 298)", pattern:"radial", count:"610+",   avgFee:"$55–$130", tagline:"Eye care & surgery" },
  { label:"Psychiatry",    Icon:Brain,       query:"psych",   grad:"linear-gradient(150deg,oklch(0.24 0.18 272) 0%,oklch(0.38 0.24 288) 55%,oklch(0.28 0.20 305) 100%)", glow:"oklch(0.56 0.26 288)", pattern:"hex",    count:"890+",   avgFee:"$80–$180", tagline:"Mental health & therapy" },
  { label:"Gynecology",    Icon:Dna,         query:"gynec",   grad:"linear-gradient(150deg,oklch(0.26 0.18 316) 0%,oklch(0.42 0.24 334) 55%,oklch(0.32 0.20 350) 100%)", glow:"oklch(0.60 0.26 334)", pattern:"grid",   count:"1,020+", avgFee:"$55–$130", tagline:"Women's health & OB/GYN" },
];

const HERO_CARDS = [
  { name:"Dr. Sarah Al-Mansouri", spec:"Cardiology",    city:"Dubai",     flag:"🇦🇪", rating:4.9, reviews:312, fee:"USD 85",  video:true,  grad:`linear-gradient(135deg,${P},${A})` },
  { name:"Dr. Lena Schmidt",      spec:"Pediatrics",    city:"Berlin",    flag:"🇩🇪", rating:4.9, reviews:440, fee:"EUR 70",  video:false, grad:`linear-gradient(135deg,${PD},${P})` },
  { name:"Dr. Nina Patel",        spec:"Psychiatry",    city:"New York",  flag:"🇺🇸", rating:5.0, reviews:287, fee:"USD 100", video:true,  grad:`linear-gradient(135deg,${A},oklch(0.45 0.24 310))` },
  { name:"Dr. Hassan Ali",        spec:"Orthopedics",   city:"Amman",     flag:"🇯🇴", rating:4.7, reviews:156, fee:"USD 90",  video:true,  grad:`linear-gradient(135deg,oklch(0.40 0.22 280),${P})` },
  { name:"Dr. Priya Sharma",      spec:"Gynecology",    city:"Mumbai",    flag:"🇮🇳", rating:4.8, reviews:390, fee:"INR 1500",video:true,  grad:`linear-gradient(135deg,oklch(0.55 0.22 0),${A})` },
  { name:"Dr. James Okafor",      spec:"Dermatology",   city:"London",    flag:"🇬🇧", rating:4.8, reviews:198, fee:"GBP 60",  video:true,  grad:`linear-gradient(135deg,oklch(0.38 0.18 240),${P})` },
  { name:"Dr. Fatima Al-Zahraa",  spec:"Neurology",     city:"Riyadh",    flag:"🇸🇦", rating:4.9, reviews:274, fee:"SAR 350", video:false, grad:`linear-gradient(135deg,${P},oklch(0.60 0.20 175))` },
  { name:"Dr. Ahmed Mansour",     spec:"Dermatology",   city:"Cairo",     flag:"🇪🇬", rating:4.8, reviews:201, fee:"EGP 800", video:false, grad:`linear-gradient(135deg,oklch(0.45 0.20 30),${A})` },
  { name:"City Dental Center",    spec:"Dentistry",     city:"Beirut",    flag:"🇱🇧", rating:4.6, reviews:88,  fee:"USD 80",  video:false, grad:`linear-gradient(135deg,oklch(0.35 0.18 155),${P})` },
];

const LIVE_EVENTS = [
  { name:"Ahmed K.",  doctor:"Dr. Hassan Ali",       spec:"Orthopedics", city:"Amman, JO", mins:2   },
  { name:"Sara M.",   doctor:"Dr. Priya Sharma",     spec:"Gynecology",  city:"Mumbai, IN", mins:5  },
  { name:"James L.",  doctor:"Dr. Ahmed Mansour",    spec:"Dermatology", city:"Dubai, AE",  mins:8  },
];

const STATS = [
  { value:"190+",    label:"Countries",          Icon:Globe2 },
  { value:"12,000+", label:"Verified Providers", Icon:Users },
  { value:"500K+",   label:"Consultations Done", Icon:CalendarDays },
  { value:"4.8",     label:"Average Rating",     Icon:Star },
];

const FEATURES = [
  { href:"/providers",    Icon:Stethoscope, grad:`linear-gradient(135deg,${PD},${P})`,             title:"Discover & Book Care",        stat:"12,000+ verified",   cta:"Discover Care",     desc:"Search verified doctors, clinics, labs & more in 190+ countries. Book in-clinic or video. Instant confirmation.", features:["In-clinic & video","Verified badges","Instant confirmation"] },
  { href:"/deals",        Icon:Tag,         grad:`linear-gradient(135deg,oklch(0.38 0.14 55),${G})`,title:"Exclusive Healthcare Deals",  stat:"Save up to 70%",    cta:"See Deals",        desc:"Discounts on consultations, check-ups, dental, labs from verified providers near you.",        features:["Claim codes","Limited-time offers","Local & online"] },
  { href:"/reels",        Icon:Clapperboard,grad:"linear-gradient(135deg,oklch(0.22 0.18 335),oklch(0.14 0.20 310))", title:"Health Reels",      stat:"500+ health videos", cta:"Watch Reels",     desc:"Short-form health education from verified doctors. Learn about symptoms, treatments, wellness.", features:["Verified creators","Searchable","Save & share"] },
  { href:"/ai-assistant", Icon:Sparkles,    grad:`linear-gradient(135deg,${A},oklch(0.38 0.22 310))`,title:"AI Health Assistant",       stat:"24/7 · Free forever",cta:"Ask the AI",      desc:"Describe your symptoms, get instant specialist guidance and drug interaction checks.",           features:["Symptom checker","Specialist match","Drug lookup"] },
  { href:"/events",       Icon:CalendarDays,grad:"linear-gradient(135deg,oklch(0.20 0.14 240),oklch(0.30 0.20 270))", title:"Medical Events",   stat:"200+ annual events", cta:"Browse Events",   desc:"Global CME conferences, webinars, and health summits. Earn CE credits. Register free.",         features:["Live & virtual","CME credits","Free registration"] },
  { href:"/travel",       Icon:Plane,       grad:`linear-gradient(135deg,oklch(0.28 0.18 175),oklch(0.40 0.22 200))`, title:"Health Travel",   stat:"40+ destinations",   cta:"Explore Packages",desc:"All-inclusive medical travel: flights, hotel, treatment, and a personal coordinator.",           features:["Verified organizers","JCI clinics","One price"] },
];

const ECOSYSTEM_TYPES = [
  { icon:Stethoscope, label:"Doctors",     bg:"#eef2ff", fg:P,          tagline:"Get booked globally" },
  { icon:Building2,   label:"Hospitals",   bg:"#e0f2fe", fg:"#0369a1",  tagline:"Facility management" },
  { icon:Pill,        label:"Pharmacies",  bg:"#dcfce7", fg:"#15803d",  tagline:"Fill e-prescriptions" },
  { icon:FlaskConical,label:"Labs",        bg:"#f5f3ff", fg:A,          tagline:"Digital results" },
  { icon:Package,     label:"Suppliers",   bg:"#fef3c7", fg:"#b45309",  tagline:"Sell to 12K+ buyers" },
  { icon:ShieldCheck, label:"Insurance",   bg:"#fff1f2", fg:"#be123c",  tagline:"Cashless network" },
  { icon:SmilePlus,   label:"Dental/Optic",bg:"#f0fdfa", fg:"#0f766e",  tagline:"Specialty clinics" },
  { icon:Plane,       label:"Travel Orgs", bg:"#f0f9ff", fg:"#0369a1",  tagline:"Medical tourism" },
];

const CYCLE_STEPS = [
  { Icon:Users,        label:"Member books" },
  { Icon:Stethoscope,  label:"Doctor prescribes" },
  { Icon:Pill,         label:"Pharmacy fills" },
  { Icon:FlaskConical, label:"Lab tests" },
  { Icon:TrendingUp,   label:"Results returned" },
  { Icon:Package,      label:"Clinic reorders" },
];

const TESTIMONIALS = [
  { name:"Amira H.", loc:"Dubai, UAE",    init:"A", bg:"#DC2626", rating:5, text:"Found a cardiologist in under 2 minutes. The video call was seamless — Qliniqit saved me a 3-hour drive to the hospital." },
  { name:"James K.", loc:"London, UK",    init:"J", bg:"#2563EB", rating:5, text:"As an expat navigating foreign healthcare is stressful. Qliniqit made it easy — English-speaking doctors, transparent fees, instant booking." },
  { name:"Sara M.",  loc:"Amman, Jordan", init:"S", bg:"#7C3AED", rating:5, text:"Booked a specialist same day. The verified reviews helped me choose confidently. Will use again for my whole family." },
];

const REELS_PREVIEW = [
  { title:"5 Warning Signs of a Heart Attack", doctor:"Dr. Amani Hassan",    spec:"Cardiologist",  views:"48.2K", dur:"2:34", grad:`linear-gradient(160deg,${PD},${P})` },
  { title:"Daily Skincare for Sensitive Skin",  doctor:"Dr. Layla Al-Rashidi",spec:"Dermatologist", views:"61K",   dur:"3:05", grad:"linear-gradient(160deg,oklch(0.22 0.18 335),oklch(0.14 0.20 310))" },
  { title:"Anxiety & Stress: What Your Body Is Telling You", doctor:"Dr. Nadia Salem", spec:"Psychiatrist", views:"52.7K", dur:"8:02", grad:`linear-gradient(160deg,${A},${PD})` },
];

const MOCK_PROVIDERS = [
  { id:1, slug:"dr-sarah-al-mansouri", name:"Dr. Sarah Al-Mansouri", avatarUrl:null, specialtyName:"Cardiology",    consultationFee:"85",  currencyCode:"USD", ratingAvg:"4.9", reviewCount:312, city:"Dubai",    countryCode:"AE", offersVideo:true,  isFeatured:true,  verificationStatus:"verified" },
  { id:2, slug:"dr-james-okafor",      name:"Dr. James Okafor",      avatarUrl:null, specialtyName:"Dermatology",   consultationFee:"60",  currencyCode:"USD", ratingAvg:"4.8", reviewCount:198, city:"London",   countryCode:"GB", offersVideo:true,  isFeatured:false, verificationStatus:"verified" },
  { id:3, slug:"dr-lena-schmidt",      name:"Dr. Lena Schmidt",      avatarUrl:null, specialtyName:"Pediatrics",    consultationFee:"70",  currencyCode:"EUR", ratingAvg:"4.9", reviewCount:440, city:"Berlin",   countryCode:"DE", offersVideo:false, isFeatured:true,  verificationStatus:"verified" },
  { id:4, slug:"dr-hassan-ali",        name:"Dr. Hassan Ali",        avatarUrl:null, specialtyName:"Orthopedics",   consultationFee:"90",  currencyCode:"USD", ratingAvg:"4.7", reviewCount:156, city:"Amman",    countryCode:"JO", offersVideo:true,  isFeatured:false, verificationStatus:"verified" },
  { id:5, slug:"dr-nina-patel",        name:"Dr. Nina Patel",        avatarUrl:null, specialtyName:"Psychiatry",    consultationFee:"100", currencyCode:"USD", ratingAvg:"5.0", reviewCount:287, city:"New York", countryCode:"US", offersVideo:true,  isFeatured:true,  verificationStatus:"verified" },
  { id:6, slug:"dr-omar-farouq",       name:"Dr. Omar Farouq",       avatarUrl:null, specialtyName:"Ophthalmology", consultationFee:"55",  currencyCode:"USD", ratingAvg:"4.8", reviewCount:201, city:"Cairo",    countryCode:"EG", offersVideo:false, isFeatured:false, verificationStatus:"verified" },
];

// ── Main component ──────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveIdx, setLiveIdx]         = useState(0);
  const [cardSlots, setCardSlots]     = useState([0, 1, 2]);
  const [fadingSlot, setFadingSlot]   = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { data: featuredData } = trpc.providers.search.useQuery({ limit: 6, page: 1 });
  const { data: eventsData   } = trpc.events.list.useQuery({ limit: 3, page: 1 });

  // Rotate live ticker
  useEffect(() => {
    const t = setInterval(() => setLiveIdx(i => i + 1), 4000);
    return () => clearInterval(t);
  }, []);

  // Rotate hero cards — one slot at a time, smooth fade
  useEffect(() => {
    const t = setInterval(() => {
      const slot = Math.floor(Math.random() * 3);
      setFadingSlot(slot);
      setTimeout(() => {
        setCardSlots(prev => {
          const next = [...prev] as [number, number, number];
          const used = new Set(next);
          let candidate = (next[slot]! + 1) % HERO_CARDS.length;
          let attempts = 0;
          while (used.has(candidate) && attempts < HERO_CARDS.length) {
            candidate = (candidate + 1) % HERO_CARDS.length;
            attempts++;
          }
          next[slot] = candidate;
          return next;
        });
        setTimeout(() => setFadingSlot(null), 400);
      }, 350);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/providers?q=${encodeURIComponent(searchQuery)}`);
  }

  const live = LIVE_EVENTS[liveIdx % LIVE_EVENTS.length]!;

  return (
    <div className="overflow-x-hidden">

      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        /* ── Float animations for hero cards ── */
        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-18px) rotate(0.8deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%     { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-9px) rotate(-0.5deg); }
        }

        /* ── Subtle gradient border strip ── */
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-strip {
          background: linear-gradient(90deg, oklch(0.47 0.22 262 / 0.5), oklch(0.54 0.24 290 / 0.8), oklch(0.75 0.18 65 / 0.6), oklch(0.54 0.24 290 / 0.8), oklch(0.47 0.22 262 / 0.5));
          background-size: 300% 100%;
          animation: gradientShift 14s ease infinite;
        }

        /* ── Marquee ── */
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* ── Pulse ring ── */
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* ── Breathing glow blobs ── */
        @keyframes breatheBlob {
          0%,100% { transform: scale(1) translate(0,0);      opacity: 0.28; }
          33%     { transform: scale(1.14) translate(24px,-18px); opacity: 0.42; }
          66%     { transform: scale(0.90) translate(-12px,22px);  opacity: 0.18; }
        }
        @keyframes breatheBlob2 {
          0%,100% { transform: scale(1) translate(0,0);       opacity: 0.20; }
          40%     { transform: scale(1.18) translate(-28px,12px); opacity: 0.32; }
          70%     { transform: scale(0.93) translate(18px,-22px); opacity: 0.14; }
        }

        /* ── Hero card fade transition ── */
        .hero-card-slot { transition: opacity 0.35s ease, transform 0.35s ease; }
        .hero-card-fading { opacity: 0; transform: translateY(8px) scale(0.97); }

        .hero-card { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .animate-floatA { animation: floatA 7s ease-in-out infinite; }
        .animate-floatB { animation: floatB 6s ease-in-out infinite 1.2s; }
        .animate-floatC { animation: floatC 5s ease-in-out infinite 2.4s; }
        .animate-marquee { animation: marqueeLeft 28s linear infinite; }
        .animate-marquee-rev { animation: marqueeRight 22s linear infinite; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden"
        style={{ background:`linear-gradient(145deg,oklch(0.16 0.22 268) 0%,${PD} 42%,oklch(0.34 0.24 280) 65%,oklch(0.26 0.20 292) 100%)`, paddingTop:88, paddingBottom:80 }}>

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"56px 56px", opacity:0.025 }}/>

        {/* Animated glow blobs */}
        <div className="absolute pointer-events-none" style={{ top:"-8%", right:"-6%", width:680, height:680, borderRadius:"50%", background:`radial-gradient(circle,oklch(0.58 0.28 292) 0%,transparent 65%)`, filter:"blur(90px)", animation:"breatheBlob 13s ease-in-out infinite" }}/>
        <div className="absolute pointer-events-none" style={{ bottom:"-15%", left:"-8%", width:520, height:520, borderRadius:"50%", background:`radial-gradient(circle,oklch(0.42 0.24 262) 0%,transparent 65%)`, filter:"blur(80px)", animation:"breatheBlob2 17s ease-in-out infinite 2s" }}/>
        <div className="absolute pointer-events-none" style={{ top:"35%", left:"36%", width:320, height:320, borderRadius:"50%", background:`radial-gradient(circle,oklch(0.82 0.18 65) 0%,transparent 70%)`, filter:"blur(70px)", animation:"breatheBlob 20s ease-in-out infinite 6s", opacity:0.14 }}/>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-6 relative"
          style={{ minHeight:"calc(100svh - 88px)" }}>

          {/* ── Left: copy + search ─────────────────────────────────── */}
          <div className="flex-1 max-w-xl w-full py-8">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 mb-7 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", color:"rgba(255,255,255,0.55)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>
              {isAr ? "منصة الرعاية الصحية الأولى عالمياً" : "The #1 Global Healthcare Platform"}
            </div>

            {/* Headline */}
            <h1 className="font-extrabold leading-[1.02] tracking-tight mb-6"
              style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(2.8rem,6vw,4.5rem)" }}>
              {isAr
                ? <><span className="text-white">صحتك</span><br/><span style={{ background:`linear-gradient(135deg,oklch(0.90 0.15 65),${G},oklch(0.85 0.18 50))`, backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>بلا حدود.</span></>
                : <><span className="text-white">Healthcare</span><br/><span style={{ background:`linear-gradient(135deg,oklch(0.90 0.15 65),${G},oklch(0.85 0.18 50))`, backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Without Borders.</span></>
              }
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color:"rgba(255,255,255,0.48)", maxWidth:480 }}>
              {isAr
                ? "ابحث عن أطباء، احجز فوراً، شاهد مقاطع صحية، احضر مؤتمرات، واحصل على توجيه ذكاء اصطناعي — كل ذلك في مكان واحد."
                : "Find doctors, book instantly, watch health reels, attend medical conferences, and get AI health guidance — all in one place."}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-5">
              <div className="flex rounded-2xl overflow-hidden shadow-2xl" style={{ background:"white" }}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2}/>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن طبيب، تخصص، أو حالة..." : "Search by doctor, specialty, or condition..."}
                    className="w-full pl-11 pr-4 py-4 text-gray-900 text-sm focus:outline-none bg-transparent placeholder-gray-400"/>
                </div>
                <button type="submit"
                  className="font-bold px-7 py-4 text-sm whitespace-nowrap m-1.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex-shrink-0"
                  style={{ background:`linear-gradient(135deg,oklch(0.80 0.17 65),${G})`, color:"oklch(0.15 0.05 262)" }}>
                  {isAr ? "بحث" : "Search"}
                </button>
              </div>
            </form>

            {/* Popular */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs font-semibold self-center" style={{ color:"rgba(255,255,255,0.28)" }}>{isAr?"شائع:":"Popular:"}</span>
              {["Cardiology","Dermatology","Pediatrics","Mental Health","Dentistry"].map(s => (
                <button key={s} onClick={() => navigate(`/providers?q=${s.toLowerCase()}`)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-white/15"
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.55)" }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Trust mini-stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.10)" }}>
                    <s.Icon className="w-3.5 h-3.5" style={{ color:"rgba(255,255,255,0.55)" }} strokeWidth={2}/>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white leading-none">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color:"rgba(255,255,255,0.3)" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile specialty quick-links — fills the empty space on small screens */}
            <div className="flex gap-2 overflow-x-auto pb-1 mt-6 lg:hidden" style={{ scrollbarWidth:"none" }}>
              {SPECIALTIES.map(s => (
                <button key={s.label} onClick={() => navigate(`/providers?q=${s.query}`)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white whitespace-nowrap transition-all hover:scale-105"
                  style={{ background:s.grad, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
                  <s.Icon className="w-3 h-3" strokeWidth={2}/> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Floating doctor cards ───────────────────────── */}
          <div className="hidden lg:block flex-1 relative" style={{ height:560, minWidth:420 }}>

            {/* Background glow behind cards */}
            <div className="absolute pointer-events-none" style={{ top:"10%", left:"10%", right:"10%", bottom:"10%", borderRadius:"50%", background:`radial-gradient(ellipse,${A}/15% 0%,transparent 70%)` }}/>

            {/* Card 1 — top right */}
            <div className={`animate-floatA absolute hero-card-slot${fadingSlot===0?" hero-card-fading":""}`} style={{ top:20, right:0, zIndex:3 }}>
              <HeroCard c={HERO_CARDS[cardSlots[0]!]!} />
            </div>

            {/* Card 2 — middle left */}
            <div className={`animate-floatB absolute hero-card-slot${fadingSlot===1?" hero-card-fading":""}`} style={{ top:170, left:0, zIndex:2 }}>
              <HeroCard c={HERO_CARDS[cardSlots[1]!]!} />
            </div>

            {/* Card 3 — bottom right */}
            <div className={`animate-floatC absolute hero-card-slot${fadingSlot===2?" hero-card-fading":""}`} style={{ bottom:40, right:20, zIndex:3 }}>
              <HeroCard c={HERO_CARDS[cardSlots[2]!]!} />
            </div>

            {/* Live notification chip — cycles automatically */}
            <div className="animate-floatB absolute" style={{ bottom:160, left:20, zIndex:4, animationDelay:"0.8s" }}>
              <div className="rounded-2xl px-4 py-3 flex items-center gap-3 hero-card"
                style={{ background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.16)", minWidth:240, transition:"all 0.4s ease" }}>
                {/* Pulse ring */}
                <div className="relative flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-[pulseRing_1.8s_ease-out_infinite]" style={{ animation:"pulseRing 1.8s ease-out infinite" }}/>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block relative"/>
                </div>
                <div style={{ transition:"all 0.4s ease" }}>
                  <p className="text-white text-xs font-bold leading-snug">{live.name} → {live.doctor}</p>
                  <p className="text-xs leading-snug" style={{ color:"rgba(255,255,255,0.42)" }}>{live.spec} · {live.city} · {live.mins}m ago</p>
                </div>
              </div>
            </div>

            {/* Floating specialty chip */}
            <div className="animate-floatA absolute" style={{ top:300, right:140, zIndex:1, animationDelay:"3s" }}>
              <div className="rounded-full px-3.5 py-2 text-xs font-bold text-white hero-card flex items-center gap-2"
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)" }}>
                <MapPin className="w-3 h-3" strokeWidth={2}/> 190 countries covered
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background:"linear-gradient(to bottom,transparent,rgba(0,0,0,0.12))" }}/>
      </section>

      {/* ══ MARQUEE TRUST STRIP ══════════════════════════════════════ */}
      <section className="py-4 border-b border-gray-100 overflow-hidden" style={{ background:"white" }}>
        {/* Row 1 — left */}
        <div className="flex items-center gap-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 whitespace-nowrap pl-6 flex-shrink-0">Trusted at</p>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-10 animate-marquee whitespace-nowrap" style={{ width:"max-content" }}>
              {[...["Johns Hopkins","Mayo Clinic","Cleveland Clinic","WHO","AMA","MENA Health","NHS","King Faisal Specialist","Aga Khan Health","Bumrungrad International"],
                ...["Johns Hopkins","Mayo Clinic","Cleveland Clinic","WHO","AMA","MENA Health","NHS","King Faisal Specialist","Aga Khan Health","Bumrungrad International"]
              ].map((org, i) => (
                <span key={i} className="flex-shrink-0 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{org}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Row 2 — right (reverse) */}
        <div className="overflow-hidden pl-6">
          <div className="flex gap-10 animate-marquee-rev whitespace-nowrap" style={{ width:"max-content" }}>
            {[...["Arab Health","HIMSS","Medscape","UpToDate","PubMed","WebMD","Cochrane","The Lancet","NEJM","BMJ"],
              ...["Arab Health","HIMSS","Medscape","UpToDate","PubMed","WebMD","Cochrane","The Lancet","NEJM","BMJ"]
            ].map((org, i) => (
              <span key={i} className="flex-shrink-0 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{org}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PLATFORM FEATURES ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background:"oklch(0.974 0.008 262)" }}>
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:A }}>
              {isAr ? "منصة شاملة" : "The Complete Platform"}
            </p>
            <h2 className="font-extrabold text-gray-900 mb-4" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(2rem,4vw,3rem)" }}>
              {isAr ? "كل ما تحتاجه للرعاية الصحية" : "One platform. Six superpowers."}
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
              {isAr ? "كل خدمات الرعاية الصحية الرقمية في مكان واحد." : "Every digital healthcare service under one roof — built for members and providers worldwide."}
            </p>
          </div>

          {/* Feature grid — 2+2+2 with first row spanning */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, idx) => (
              <Link key={f.href} href={f.href}
                className="group relative bg-white border border-gray-100 rounded-3xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all overflow-hidden">

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ background: f.grad }} />

                {/* Hover gradient wash */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none rounded-3xl"
                  style={{ background: f.grad }}/>

                {/* Large icon watermark */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 pointer-events-none opacity-[0.045]">
                  <f.Icon className="w-full h-full text-gray-900" strokeWidth={0.5}/>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background:f.grad }}>
                  <f.Icon className="w-6 h-6 text-white" strokeWidth={1.75}/>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-gray-900 text-lg leading-snug" style={{ fontFamily:"var(--font-heading)" }}>{f.title}</h3>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors" strokeWidth={2}/>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
                    {f.features.map(feat => (
                      <span key={feat} className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" strokeWidth={2.5}/>{feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <span className="text-sm font-extrabold" style={{ color:"oklch(0.47 0.22 262)" }}>{f.stat}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl group-hover:shadow-lg transition-shadow"
                    style={{ background:f.grad }}>
                    {f.cta} <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated gradient divider strip ── */}
      <div className="animated-strip h-0.5 w-full"/>

      {/* ══ STATS BANNER ═════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background:`radial-gradient(ellipse 80% 80% at 0% 100%, oklch(0.62 0.28 295 / 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 60% at 100% 0%, oklch(0.82 0.18 65 / 0.22) 0%, transparent 50%), linear-gradient(135deg,${PD} 0%,${P} 52%,${A} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize:"32px 32px" }}/>
        <div className="max-w-5xl mx-auto relative grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s,i) => (
            <CountUpStat key={i} Icon={s.Icon} value={s.value} label={s.label} delay={i * 150}/>
          ))}
        </div>
      </section>

      {/* ── Animated gradient divider strip ── */}
      <div className="animated-strip h-0.5 w-full"/>

      {/* ══ BROWSE BY SPECIALTY ══════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background:"oklch(0.955 0.012 258)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:A }}>
                {isAr ? "التخصصات" : "Specialties"}
              </p>
              <h2 className="font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3.5vw,2.5rem)" }}>
                {isAr ? "تصفح حسب التخصص" : "Browse by Specialty"}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">{isAr ? "ابحث عن الطبيب المناسب" : "Click any specialty to see verified providers, fees & availability"}</p>
            </div>
            <Link href="/providers" className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap hover:gap-3 transition-all" style={{ color:A }}>
              {isAr ? "عرض الكل" : "All specialties"} <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPECIALTIES.map(s => (
              <Link key={s.label} href={`/providers?q=${s.query}`}
                className="group rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 relative flex flex-col"
                style={{ background: s.grad, minHeight:190, boxShadow:"0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
                {/* Subtle geometric pattern — dots, hex, or grid */}
                {s.pattern === "dots" && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize:"18px 18px" }}/>
                )}
                {s.pattern === "grid" && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.9) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize:"20px 20px" }}/>
                )}
                {s.pattern === "hex" && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize:"14px 24px", backgroundPosition:"0 0, 7px 12px" }}/>
                )}
                {s.pattern === "radial" && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage:"radial-gradient(ellipse 200% 200% at 110% 110%,rgba(255,255,255,0.12) 0%,transparent 60%),repeating-radial-gradient(circle at 110% 110%,transparent 0,transparent 16px,rgba(255,255,255,0.04) 16px,rgba(255,255,255,0.04) 17px)" }}/>
                )}
                {/* Jumbo icon — decorative background watermark */}
                <div className="absolute pointer-events-none" style={{ bottom:"-10%", right:"-8%", opacity:0.10 }}>
                  <s.Icon style={{ width:140, height:140, color:"white", strokeWidth:1.2 }}/>
                </div>
                {/* Radial glow — bottom-right accent */}
                <div className="absolute pointer-events-none" style={{ bottom:"-20%", right:"-20%", width:"75%", height:"75%", borderRadius:"50%", background:`radial-gradient(circle,${s.glow} 0%,transparent 65%)`, filter:"blur(32px)", opacity:0.35 }}/>
                {/* Noise texture overlay for depth */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"128px" }}/>
                {/* Top: icon + count */}
                <div className="flex items-start justify-between p-5 pb-0 relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.20)" }}>
                    <s.Icon className="w-5 h-5 text-white" strokeWidth={1.8}/>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(0,0,0,0.25)", color:"rgba(255,255,255,0.90)", letterSpacing:"0.02em" }}>
                    {s.count}
                  </span>
                </div>
                {/* Bottom: text */}
                <div className="flex-1 flex flex-col justify-end p-5 relative z-10">
                  <p className="font-extrabold text-white leading-tight mb-1" style={{ fontSize:"1.05rem", textShadow:"0 1px 8px rgba(0,0,0,0.30)" }}>{s.label}</p>
                  <p className="text-xs font-medium mb-4" style={{ color:"rgba(255,255,255,0.72)" }}>{s.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(0,0,0,0.22)", color:"rgba(255,255,255,0.80)" }}>avg {s.avgFee}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                      style={{ color:"white" }}>
                      View all <ArrowRight className="w-3 h-3" strokeWidth={2.5}/>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Bottom CTA bar */}
          <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background:"white", border:"1px solid oklch(0.90 0.008 262)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${A}18` }}>
                <Search className="w-4 h-4" style={{ color:A }}/>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Can't find your specialty?</p>
                <p className="text-xs text-gray-400">Search across 60+ specialties and 12,000+ verified providers</p>
              </div>
            </div>
            <Link href="/providers"
              className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background:`linear-gradient(135deg,${A},${P})`, color:"white" }}>
              Browse All Providers <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ HEALTH TRAVEL TEASER (unique — no competitor has this) ═══ */}
      <section className="px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background:`linear-gradient(145deg,oklch(0.18 0.16 200) 0%,oklch(0.26 0.20 220) 50%,oklch(0.32 0.22 250) 100%)`, minHeight:320 }}>

            {/* Background travel image overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage:"url(https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&q=80)", backgroundSize:"cover", backgroundPosition:"center" }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(to right,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.2) 60%,transparent 100%)" }}/>

            <div className="relative px-10 py-12 flex flex-col md:flex-row items-center gap-10">
              {/* Left */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-5 text-xs font-bold uppercase tracking-widest px-3.5 py-2 rounded-full"
                  style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.6)" }}>
                  <Plane className="w-3.5 h-3.5" strokeWidth={2}/> Health Tourism Packages · New
                </div>
                <h2 className="font-extrabold text-white mb-3" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.5rem)" }}>
                  World-Class Care.<br/>Seamless Travel.
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color:"rgba(255,255,255,0.5)", maxWidth:400 }}>
                  All-inclusive packages — flights, hotel, treatment, and a dedicated coordinator in 40+ destinations. One price. Zero stress.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/travel"
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    style={{ background:`linear-gradient(135deg,oklch(0.80 0.17 65),${G})`, color:"oklch(0.15 0.05 262)" }}>
                    Browse Packages <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
                  </Link>
                  <Link href="/pricing"
                    className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                    style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.8)" }}>
                    List Your Package
                  </Link>
                </div>
              </div>

              {/* Right: destination bubbles */}
              <div className="hidden md:flex flex-wrap gap-3 max-w-xs justify-center">
                {[
                  { flag:"🇹🇷", city:"Istanbul", spec:"Dental", price:"$1,890" },
                  { flag:"🇯🇴", city:"Amman",    spec:"Hair",   price:"$2,100" },
                  { flag:"🇩🇪", city:"Munich",   spec:"Ortho",  price:"$9,800" },
                  { flag:"🇹🇭", city:"Bangkok",  spec:"LASIK",  price:"$1,450" },
                ].map(d => (
                  <div key={d.city} className="rounded-2xl px-4 py-3 text-center"
                    style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", minWidth:120 }}>
                    <p className="text-2xl mb-1">{d.flag}</p>
                    <p className="text-white font-bold text-xs">{d.city}</p>
                    <p className="text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>{d.spec}</p>
                    <p className="font-extrabold text-sm mt-1" style={{ color:G }}>{d.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HEALTHCARE ECOSYSTEM ═════════════════════════════════════ */}
      <section className="py-24 px-6"
        style={{ background:"linear-gradient(180deg,white 0%,oklch(0.97 0.02 262) 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:A }}>
              {isAr ? "منظومة متكاملة" : "The Complete Ecosystem"}
            </p>
            <h2 className="font-extrabold text-gray-900 mb-4" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(2rem,3.5vw,2.8rem)" }}>
              {isAr ? "ليس فقط للأطباء." : "Not just for doctors."}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
              {isAr
                ? "Qliniqit يجمع كل مشاركي منظومة الرعاية الصحية في مكان واحد."
                : "Qliniqit connects every healthcare participant — from doctors to travel organizers — so every transaction creates value for the whole network."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {ECOSYSTEM_TYPES.map(t => (
              <Link key={t.label} href="/pricing"
                className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background:t.bg }}>
                  <t.icon className="w-6 h-6" style={{ color:t.fg }} strokeWidth={1.75}/>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">{t.label}</p>
                  <p className="text-xs text-gray-400 leading-snug">{t.tagline}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Endless cycle */}
          <div className="rounded-3xl overflow-hidden"
            style={{ background:`linear-gradient(145deg,${PD} 0%,${P} 55%,${A} 100%)` }}>
            <div className="px-8 pt-10 pb-6 text-center">
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.45)" }}>
                <Repeat2 className="w-3.5 h-3.5" strokeWidth={2}/>The Endless Economic Cycle
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily:"var(--font-heading)" }}>
                Every interaction creates value for everyone
              </h3>
              <p className="text-sm max-w-lg mx-auto mb-8" style={{ color:"rgba(255,255,255,0.38)" }}>
                Member → Provider → Pharmacy → Lab → Supplier → Insurer → Travel Organizer → Platform → Everyone wins.
              </p>
              <div className="flex items-center justify-center flex-wrap gap-0">
                {CYCLE_STEPS.map((s,i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center px-3 py-3 rounded-2xl mx-1"
                      style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.10)", minWidth:72 }}>
                      <s.Icon className="w-5 h-5 mb-1" style={{ color:"rgba(255,255,255,0.65)" }} strokeWidth={1.75}/>
                      <span className="text-[10px] font-semibold text-center leading-snug" style={{ color:"rgba(255,255,255,0.55)" }}>{s.label}</span>
                    </div>
                    {i < CYCLE_STEPS.length - 1 && <ChevronRight className="w-4 h-4 mx-0.5 flex-shrink-0" style={{ color:"rgba(255,255,255,0.2)" }} strokeWidth={2}/>}
                  </div>
                ))}
                <ChevronRight className="w-4 h-4 mx-0.5 flex-shrink-0" style={{ color:"rgba(255,255,255,0.2)" }} strokeWidth={2}/>
                <div className="flex flex-col items-center px-3 py-3 rounded-2xl mx-1"
                  style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.20)", minWidth:72 }}>
                  <Repeat2 className="w-6 h-6 mb-1" style={{ color:"rgba(255,255,255,0.6)" }} strokeWidth={1.75}/>
                  <span className="text-[10px] font-semibold text-center leading-snug" style={{ color:"rgba(255,255,255,0.55)" }}>Cycle repeats</span>
                </div>
              </div>
            </div>
            <div className="border-t px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ borderColor:"rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-white font-bold text-sm">Ready to join the ecosystem?</p>
                <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.35)" }}>Choose your business type and get listed free today.</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Link href="/providers" className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90"
                  style={{ background:`linear-gradient(135deg,oklch(0.80 0.17 65),${G})`, color:"oklch(0.15 0.05 262)" }}>
                  I'm a Member <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:bg-white/15"
                  style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"white" }}>
                  I'm a Business <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROVIDER SPOTLIGHT ══════════════════════════════════════ */}
      {(() => {
        const spotlight = featuredData?.providers?.length ? featuredData.providers : MOCK_PROVIDERS;
        return (
          <section className="py-20 px-6" style={{ background:"linear-gradient(180deg,#f8f7ff 0%,white 100%)" }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:P }}>Provider Spotlight</p>
                  <h2 className="font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.4rem)" }}>
                    Top-Rated. Available Now.
                  </h2>
                  <p className="text-gray-400 mt-1.5 text-sm">Every provider is identity-verified and reviewed by real members</p>
                </div>
                <Link href="/providers" className="inline-flex items-center gap-1.5 text-sm font-bold hover:gap-3 transition-all whitespace-nowrap" style={{ color:P }}>
                  Browse all 12,000+ <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {spotlight.slice(0,6).map((p, idx) => {
                  const grads = [
                    `linear-gradient(135deg,${P},${A})`,
                    `linear-gradient(135deg,${A},oklch(0.68 0.19 335))`,
                    `linear-gradient(135deg,${P},${G})`,
                    `linear-gradient(135deg,oklch(0.40 0.22 280),${P})`,
                    `linear-gradient(135deg,oklch(0.65 0.17 175),${P})`,
                    `linear-gradient(135deg,oklch(0.68 0.21 15),${A})`,
                  ];
                  const g = grads[idx % 6]!;
                  const avail = idx % 3 === 0 ? "Available today" : idx % 3 === 1 ? "Next: Tomorrow 9am" : "Next: Mon 2pm";
                  return (
                    <Link key={p.id} href={`/providers/${p.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all border border-gray-100 flex flex-col">
                      <div className="h-1.5" style={{ background:g }}/>
                      <div className="px-5 pt-5 pb-4 flex items-start gap-4">
                        {p.avatarUrl
                          ? <img src={p.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md flex-shrink-0"/>
                          : <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white flex-shrink-0 shadow-md" style={{ background:g }}>
                              {(p.name ?? "?")[0]}
                            </div>}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <p className="font-extrabold text-gray-900 text-sm leading-snug">{p.name}</p>
                            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                              <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5}/>Verified
                            </span>
                          </div>
                          {p.specialtyName && <p className="text-xs font-semibold mb-0.5" style={{ color:P }}>{p.specialtyName}</p>}
                          <p className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" strokeWidth={2}/>{p.city}{p.countryCode ? `, ${p.countryCode}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="px-5 pb-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.ratingAvg && (
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                              <StarFill className="w-3 h-3"/>
                              {Number(p.ratingAvg).toFixed(1)}
                              <span className="text-gray-400 font-normal">({p.reviewCount})</span>
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ml-auto ${avail === "Available today" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                            {avail === "Available today" ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>{avail}</> : <><Clock className="w-3 h-3" strokeWidth={2}/>{avail}</>}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.offersVideo && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"#f0eeff", color:P }}>
                              <Video className="w-3 h-3" strokeWidth={2}/>Video
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
                            <ShieldCheck className="w-3 h-3" strokeWidth={2}/>ID Verified
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-50 mt-auto">
                          <div>
                            <p className="font-extrabold text-base" style={{ color:P }}>
                              {p.consultationFee ? `${p.currencyCode ?? "USD"} ${Number(p.consultationFee).toFixed(0)}` : "Free"}
                            </p>
                            <p className="text-xs text-gray-400">per session</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all"
                            style={{ background:g }}>
                            Book <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-10 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
                style={{ background:`linear-gradient(135deg,oklch(0.97 0.02 262),oklch(0.93 0.04 285))`, border:`1px solid oklch(0.90 0.06 262)` }}>
                <div>
                  <p className="font-extrabold text-gray-900 text-lg mb-1" style={{ fontFamily:"var(--font-heading)" }}>Are you a healthcare provider?</p>
                  <p className="text-gray-400 text-sm">Get listed, attract members globally, grow your practice — free to start.</p>
                </div>
                <Link href="/pricing"
                  className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 shadow-lg"
                  style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
                  Get Listed Free <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background:"white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:A }}>Simple & Fast</p>
            <h2 className="font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.5rem)" }}>
              Get care in 3 steps
            </h2>
            <p className="text-gray-400 mt-2">From search to consultation in under 5 minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon:Search,       step:"01", c:P, title:"Search & Filter",  desc:"Find verified providers by specialty, city, language, or fee. Compare ratings side by side.", time:"< 2 min" },
              { Icon:CalendarDays, step:"02", c:A, title:"Book Your Slot",   desc:"Pick a time — in-clinic or video. Confirmed instantly with a calendar invite.", time:"< 1 min" },
              { Icon:CheckCircle2, step:"03", c:"oklch(0.50 0.18 155)", title:"Get Care", desc:"Attend your consultation. Leave a review and manage follow-ups from your dashboard.", time:"Same day" },
            ].map((s,i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all relative overflow-hidden">
                <p className="absolute top-5 right-6 font-black select-none leading-none text-7xl"
                  style={{ fontFamily:"var(--font-heading)", color:s.c, opacity:0.06 }}>{s.step}</p>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white"
                  style={{ background:s.c }}>
                  <s.Icon className="w-6 h-6" strokeWidth={2}/>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2" style={{ fontFamily:"var(--font-heading)" }}>{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background:s.c }}>
                  <Clock className="w-3 h-3" strokeWidth={2}/>{s.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated gradient divider strip ── */}
      <div className="animated-strip h-0.5 w-full"/>

      {/* ══ EVENTS ══════════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background:`linear-gradient(145deg,oklch(0.14 0.18 268) 0%,oklch(0.20 0.20 278) 50%,oklch(0.26 0.22 295) 100%)` }}>
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{ top:"-20%", right:"-10%", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${A} 0%,transparent 65%)`, filter:"blur(100px)", opacity:0.18 }}/>
        <div className="absolute pointer-events-none" style={{ bottom:"-20%", left:"-8%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${P} 0%,transparent 65%)`, filter:"blur(80px)", opacity:0.22 }}/>

        <div className="max-w-5xl mx-auto relative">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", color:G }}>
                <Ticket className="w-3.5 h-3.5" strokeWidth={2}/> Events & Conferences
              </div>
              <h2 className="font-extrabold text-white" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.4rem)" }}>Upcoming Medical Events</h2>
              <p className="mt-1 text-sm" style={{ color:"rgba(255,255,255,0.45)" }}>Conferences, CME webinars, and health summits — register free</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-3" style={{ color:G }}>
              View all <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>

          {/* Events grid: featured (large) + 2 smaller */}
          {(() => {
            const FALLBACK_EVENTS = [
              { type:"Conference", title:"Arab Health 2026", desc:"The world's largest healthcare gathering — 3,500+ exhibitors from 70+ countries.", date:"Jan 27–30, 2026", loc:"Dubai, UAE", attendees:"55,000+", cme:true,  free:true,  accent:`linear-gradient(135deg,oklch(0.46 0.22 32),oklch(0.58 0.24 22))` },
              { type:"Webinar",    title:"Qliniqit Provider Summit", desc:"Live training: teleconsultation tools, reels & analytics. For verified providers.", date:"Jun 25, 2026", loc:"Online", attendees:"2,400+", cme:false, free:true,  accent:`linear-gradient(135deg,${P},${A})` },
              { type:"Summit",     title:"European Cardiology Summit", desc:"Cutting-edge cardiovascular advances from Europe's leading heart specialists.", date:"Aug 30, 2026", loc:"Amsterdam", attendees:"8,000+", cme:true, free:false, accent:`linear-gradient(135deg,oklch(0.32 0.18 240),oklch(0.46 0.20 268))` },
            ];
            const events = (eventsData && eventsData.length > 0
              ? eventsData.slice(0,3).map((ev,i) => ({
                  type:ev.type?.replace("_"," ") ?? "Event",
                  title:ev.title,
                  desc:ev.description ?? "",
                  date:new Date(ev.startDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
                  loc:ev.location ?? "Online",
                  attendees:"", cme:false, free:true,
                  accent: FALLBACK_EVENTS[i % 3].accent,
                }))
              : FALLBACK_EVENTS
            );
            const [featured, ...rest] = events;
            return (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Featured event — spans 3 cols */}
                <Link href="/events"
                  className="group md:col-span-3 rounded-2xl overflow-hidden relative flex flex-col hover:-translate-y-1 transition-all duration-300"
                  style={{ background: featured.accent, minHeight:260 }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)" }}/>
                  <div className="relative flex-1 p-7 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                          style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)" }}>
                          <Ticket className="w-3 h-3" strokeWidth={2}/>{featured.type}
                        </span>
                        {featured.cme && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background:G, color:"oklch(0.15 0.05 262)" }}>
                            CME Credits
                          </span>
                        )}
                        {featured.free && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-400/90 text-white">
                            Free Entry
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-xl leading-tight mb-2" style={{ fontFamily:"var(--font-heading)" }}>
                        {featured.title}
                      </h3>
                      <p className="text-sm mb-5 line-clamp-2" style={{ color:"rgba(255,255,255,0.65)" }}>{featured.desc}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-4 text-xs" style={{ color:"rgba(255,255,255,0.60)" }}>
                          <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/>{featured.date}</span>
                          <span className="flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5"/>{featured.loc}</span>
                          {featured.attendees && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/>{featured.attendees} attending</span>}
                        </div>
                        <span className="inline-flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl text-white group-hover:gap-3 transition-all"
                          style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)" }}>
                          Register <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Two smaller cards — span 2 cols */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {rest.map((ev,i) => (
                    <Link key={i} href="/events"
                      className="group rounded-2xl overflow-hidden relative flex flex-col hover:-translate-y-1 transition-all duration-300"
                      style={{ background: ev.accent, flex:1, minHeight:118 }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.40) 100%)" }}/>
                      <div className="relative flex-1 p-5 flex flex-col justify-between">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                            style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(6px)" }}>
                            <Ticket className="w-3 h-3" strokeWidth={2}/>{ev.type}
                          </span>
                          {ev.cme && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:G, color:"oklch(0.15 0.05 262)" }}>CME</span>}
                          {ev.free && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/90 text-white">Free</span>}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm leading-snug mb-3 line-clamp-2">{ev.title}</p>
                          <div className="flex items-center justify-between gap-2 text-xs" style={{ color:"rgba(255,255,255,0.55)" }}>
                            <div className="flex flex-wrap gap-3">
                              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/>{ev.date}</span>
                              <span className="flex items-center gap-1"><Globe2 className="w-3 h-3"/>{ev.loc}</span>
                            </div>
                            <span className="flex items-center gap-1 font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Register <ArrowRight className="w-3 h-3" strokeWidth={2.5}/>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Bottom CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-4"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.10)" }}>
            <p className="text-sm" style={{ color:"rgba(255,255,255,0.50)" }}>
              200+ medical events per year · CME credits · Free registration available
            </p>
            <Link href="/events"
              className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background:`linear-gradient(135deg,${G},oklch(0.65 0.18 55))`, color:"oklch(0.14 0.05 262)" }}>
              Browse All Events <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ HEALTH REELS ════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background:"white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#DB2777" }}>Health Reels</p>
              <h2 className="font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.4rem)" }}>
                Learn from Verified Doctors
              </h2>
              <p className="text-gray-400 mt-1 text-sm">Short-form health education in under 10 minutes</p>
            </div>
            <Link href="/reels" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all" style={{ color:"#DB2777" }}>
              Watch all <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {REELS_PREVIEW.map(r => (
              <Link key={r.title} href="/reels"
                className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all">
                <div className="relative" style={{ aspectRatio:"16/9", background:r.grad }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.20)", backdropFilter:"blur(8px)" }}>
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" strokeWidth={0}/>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg font-semibold">{r.dur}</div>
                  <div className="absolute bottom-2 left-2 text-white/60 text-xs">{r.views} views</div>
                </div>
                <div className="bg-white p-4 border border-t-0 border-gray-100 rounded-b-3xl">
                  <p className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-snug">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.doctor} · {r.spec}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AI ASSISTANT TEASER (with chat mockup) ═══════════════════ */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background:`linear-gradient(135deg,${A} 0%,${P} 60%,${PD} 100%)` }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

            <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
              {/* Left: copy */}
              <div className="flex-1 text-white">
                <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.6)" }}>
                  <Zap className="w-3.5 h-3.5" strokeWidth={2}/>Powered by AI · Free Forever
                </div>
                <h2 className="font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.4rem)" }}>
                  AI Health Assistant
                </h2>
                <p className="mb-7 leading-relaxed text-sm max-w-sm" style={{ color:"rgba(255,255,255,0.5)" }}>
                  Describe your symptoms and get instant guidance on which specialist to see. Available 24/7, completely free.
                </p>
                <Link href="/ai-assistant"
                  className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-2xl text-sm shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background:`linear-gradient(135deg,oklch(0.80 0.17 65),${G})`, color:"oklch(0.15 0.05 262)" }}>
                  Try it free now <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
                </Link>
              </div>

              {/* Right: chat mockup */}
              <div className="hidden md:flex flex-col gap-3 w-72 flex-shrink-0">
                {[
                  { role:"user", msg:"I've had chest tightness and shortness of breath for 2 days." },
                  { role:"ai",   msg:"These symptoms can indicate cardiac or respiratory issues. I recommend seeing a Cardiologist urgently. Would you like me to find one available today near you?" },
                  { role:"user", msg:"Yes please, in Dubai." },
                ].map((m, i) => (
                  <div key={i} className={`flex gap-2 items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "ai" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                        style={{ background:"rgba(255,255,255,0.12)" }}>
                        <Bot className="w-4 h-4 text-white/70" strokeWidth={1.5}/>
                      </div>
                    )}
                    <div className={`text-xs rounded-2xl px-3.5 py-2.5 max-w-[200px] leading-relaxed`}
                      style={m.role === "ai"
                        ? { background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.75)", borderBottomLeftRadius:4 }
                        : { background:"rgba(255,255,255,0.9)", color:"oklch(0.32 0.18 262)", borderBottomRightRadius:4, fontWeight:500 }}>
                      {m.msg}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-2xl"
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)" }}>
                  <MessageCircle className="w-4 h-4 text-white/30 flex-shrink-0" strokeWidth={1.75}/>
                  <span className="text-xs flex-1" style={{ color:"rgba(255,255,255,0.3)" }}>Describe your symptoms...</span>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,oklch(0.80 0.17 65),${G})` }}>
                    <ArrowRight className="w-3 h-3" style={{ color:"oklch(0.15 0.05 262)" }} strokeWidth={2.5}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Animated gradient divider strip ── */}
      <div className="animated-strip h-0.5 w-full"/>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{ background:`linear-gradient(145deg,oklch(0.20 0.16 262) 0%,oklch(0.28 0.20 262) 50%,oklch(0.30 0.22 285) 100%)` }}>
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"rgba(255,255,255,0.28)" }}>Real Stories</p>
            <h2 className="font-extrabold text-white" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(1.8rem,3vw,2.4rem)" }}>
              Loved by members worldwide
            </h2>
            <p className="mt-2" style={{ color:"rgba(255,255,255,0.32)" }}>Real reviews from confirmed appointments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-3xl p-7 hover:-translate-y-1 transition-all flex flex-col"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_,i) => <StarFill key={i} className="w-3.5 h-3.5 text-amber-400"/>)}
                </div>
                {/* Quote */}
                <p className="text-sm leading-relaxed mb-7 flex-1" style={{ color:"rgba(255,255,255,0.6)" }}>"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-5" style={{ borderTop:"1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background:t.bg }}>
                    {t.init}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.3)" }}>{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section className="py-24 px-6"
        style={{ background:"linear-gradient(145deg,oklch(0.96 0.02 262) 0%,oklch(0.93 0.04 285) 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:A }}>Start today — it's free</p>
          <h2 className="font-extrabold text-gray-900 mb-4" style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(2rem,4vw,3rem)" }}>
            Your health journey starts here
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Free to join. Instant access to all platform features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/providers"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
              style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
              Find a Doctor <ArrowRight className="w-4 h-4"/>
            </Link>
            <Link href="/ai-assistant"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm border-2 hover:bg-white/80 transition-all"
              style={{ borderColor:A, color:A, background:"rgba(255,255,255,0.6)" }}>
              <Sparkles className="w-4 h-4" strokeWidth={2}/>Ask AI Free
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-bold text-sm hover:border-gray-300 hover:bg-white transition-all">
              For Providers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function HeroCard({ c }: { c: typeof HERO_CARDS[0] }) {
  return (
    <div className="hero-card rounded-2xl px-4 py-4 w-64 shadow-2xl"
      style={{ background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
          style={{ background:c.grad }}>
          {c.name[3]}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-xs leading-snug truncate">{c.name}</p>
          <p className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>{c.spec}</p>
        </div>
        <span className="ml-auto flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{ background:"rgba(16,185,129,0.2)", color:"rgb(52,211,153)", fontSize:9 }}>●&nbsp;Live</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <StarFill className="w-3 h-3 text-amber-400"/>
          <span className="text-white font-bold text-xs">{c.rating}</span>
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.38)" }}>({c.reviews})</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" style={{ color:"rgba(255,255,255,0.4)" }} strokeWidth={2}/>
          <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>{c.city} {c.flag}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}>
        <span className="text-xs font-extrabold" style={{ color:"rgba(255,255,255,0.85)" }}>{c.fee}<span className="font-normal text-[10px] ml-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>/session</span></span>
        <div className="flex gap-1.5">
          {c.video && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)" }}>
              <Video className="w-3 h-3" strokeWidth={2}/>Video
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg text-white"
            style={{ background:c.grad }}>
            Book →
          </span>
        </div>
      </div>
    </div>
  );
}

function StarFill({ className }: { className?: string }) {
  return <svg className={className ?? "w-3.5 h-3.5 fill-amber-400"} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

// ── Count-up stat ────────────────────────────────────────────────────────────
function CountUpStat({ Icon, value, label, delay = 0 }: { Icon:IconComponent; value:string; label:string; delay?:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
      const suffix  = value.replace(/[0-9.]/g, "");
      if (isNaN(numeric)) { setDisplayed(value); return; }
      const duration = 1600;
      const start = performance.now();
      function step(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const cur = Math.floor(numeric * eased);
        setDisplayed(cur.toLocaleString() + suffix);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.10)" }}>
        <Icon className="w-5 h-5" style={{ color:"rgba(255,255,255,0.6)" }} strokeWidth={1.75}/>
      </div>
      <p className="font-extrabold text-white mb-1.5 group-hover:scale-105 transition-transform inline-block"
        style={{ fontFamily:"var(--font-heading)", fontSize:"clamp(2rem,4vw,3rem)" }}>
        {displayed || value}
      </p>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.35)" }}>{label}</p>
    </div>
  );
}
