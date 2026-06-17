import { useState } from "react";
import { Link } from "wouter";
import { Clapperboard, Star, CheckCircle2, Heart, PlayCircle, Search, Video, ArrowRight, Eye } from "lucide-react";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";

type Reel = {
  id: string; title: string; provider: string; providerSpecialty: string;
  providerInitial: string; providerColor: string; duration: string;
  views: number; likes: number; tags: string[]; category: string;
  isVerified: boolean; isFeatured?: boolean;
};

const REELS: Reel[] = [
  { id:"1", title:"5 Warning Signs of a Heart Attack You Should Never Ignore", provider:"Dr. Amani Hassan", providerSpecialty:"Cardiologist", providerInitial:"A", providerColor:"bg-red-100 text-red-700", duration:"2:34", views:48200, likes:3100, tags:["Heart Health","Emergency","Cardiology"], category:"Cardiology", isVerified:true, isFeatured:true },
  { id:"2", title:"How to Read Your Blood Test Results", provider:"Dr. Khalid Mansour", providerSpecialty:"Internal Medicine", providerInitial:"K", providerColor:"bg-blue-100 text-blue-700", duration:"4:12", views:29500, likes:1840, tags:["Lab Results","Blood Tests","Primary Care"], category:"General Health", isVerified:true, isFeatured:true },
  { id:"3", title:"Daily Skincare Routine for Sensitive Skin", provider:"Dr. Layla Al-Rashidi", providerSpecialty:"Dermatologist", providerInitial:"L", providerColor:"bg-pink-100 text-pink-700", duration:"3:05", views:61000, likes:4200, tags:["Skincare","Dermatology","Sensitive Skin"], category:"Dermatology", isVerified:true, isFeatured:true },
  { id:"4", title:"Understanding Your Child's Vaccination Schedule", provider:"Dr. Fatima Yousuf", providerSpecialty:"Pediatrician", providerInitial:"F", providerColor:"bg-yellow-100 text-yellow-700", duration:"5:20", views:22300, likes:1650, tags:["Vaccines","Child Health","Pediatrics"], category:"Pediatrics", isVerified:true },
  { id:"5", title:"Managing Type 2 Diabetes Through Diet", provider:"Dr. Omar Nasser", providerSpecialty:"Endocrinologist", providerInitial:"O", providerColor:"bg-emerald-100 text-emerald-700", duration:"6:47", views:35800, likes:2910, tags:["Diabetes","Nutrition","Endocrinology"], category:"Nutrition", isVerified:true },
  { id:"6", title:"Back Pain Exercises You Can Do At Home", provider:"Dr. Rania Khoury", providerSpecialty:"Orthopedic Surgeon", providerInitial:"R", providerColor:"bg-orange-100 text-orange-700", duration:"7:15", views:44100, likes:3320, tags:["Back Pain","Exercise","Orthopedics"], category:"Orthopedics", isVerified:false },
  { id:"7", title:"Signs You Need to See an Eye Doctor", provider:"Dr. Sami Ibrahim", providerSpecialty:"Ophthalmologist", providerInitial:"S", providerColor:"bg-indigo-100 text-indigo-700", duration:"3:58", views:18400, likes:1200, tags:["Eye Health","Vision","Ophthalmology"], category:"Ophthalmology", isVerified:true },
  { id:"8", title:"Anxiety and Stress: What Your Body is Telling You", provider:"Dr. Nadia Salem", providerSpecialty:"Psychiatrist", providerInitial:"N", providerColor:"bg-purple-100 text-purple-700", duration:"8:02", views:52700, likes:4680, tags:["Mental Health","Anxiety","Psychiatry"], category:"Mental Health", isVerified:true },
  { id:"9", title:"What Happens During a Dental Implant Procedure", provider:"Dr. Yousef Al-Amin", providerSpecialty:"Dentist", providerInitial:"Y", providerColor:"bg-green-100 text-green-700", duration:"4:30", views:27900, likes:2050, tags:["Dental","Implants","Oral Health"], category:"Dentistry", isVerified:true },
];

const CATEGORIES = ["All","Cardiology","Dermatology","General Health","Pediatrics","Mental Health","Nutrition","Orthopedics","Dentistry"];

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

function ReelCard({ reel, featured = false }: { reel: Reel; featured?: boolean }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className={`bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group ${
      featured ? "sm:flex" : ""
    }`}>
      {/* Thumbnail */}
      <div className={`relative flex items-center justify-center bg-gray-900 ${
        featured ? "sm:w-64 sm:flex-shrink-0" : ""
      } aspect-video`}>
        <div className="absolute inset-0 opacity-20"
          style={{ background:`linear-gradient(145deg,${PD},${A})` }}/>
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors">
          <PlayCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-lg font-medium">
          {reel.duration}
        </div>
        {reel.isFeatured && (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">
            <Star className="w-3 h-3 fill-amber-900 text-amber-900" strokeWidth={0}/> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {reel.tags.slice(0,2).map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background:"oklch(0.95 0.04 262)", color:P }}>{t}</span>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">{reel.title}</h3>

        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${reel.providerColor}`}>
            {reel.providerInitial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-gray-800 truncate">{reel.provider}</p>
              {reel.isVerified && (
                <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-green-600" strokeWidth={2.5}/>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{reel.providerSpecialty}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3 h-3" strokeWidth={2}/> {formatViews(reel.views)} views
          </div>
          <button onClick={() => setLiked(l => !l)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all font-medium ${
              liked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500"
            }`}>
            <Heart className={`w-3 h-3 ${liked ? "fill-red-400 text-red-400" : ""}`} strokeWidth={liked?0:2}/>
            {formatViews(reel.likes + (liked ? 1 : 0))}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = REELS.filter(r => {
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = REELS.filter(r => r.isFeatured);

  return (
    <main>
      {/* Hero */}
      <div className="relative text-white py-16 px-6 overflow-hidden"
        style={{ background:`linear-gradient(145deg,${PD} 0%,${P} 55%,${A} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass text-white/70 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <Clapperboard className="w-3.5 h-3.5" strokeWidth={2}/> Short-form Health Content
          </div>
          <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)" }}>Health Reels</h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-8">
            Expert health tips from verified doctors — in under 10 minutes.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2}/>
            <input type="text" placeholder="Search by topic or doctor…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-900 text-sm focus:outline-none shadow-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Featured */}
        {!searchQuery && activeCategory === "All" && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={0}/>
                <h2 className="text-xl font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)" }}>
                  Featured Reels
                </h2>
              </div>
              <span className="text-sm text-gray-400">{featured.length} videos</span>
            </div>
            <div className="space-y-4">
              {featured.map(r => <ReelCard key={r.id} reel={r} featured />)}
            </div>
          </section>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className="text-sm px-4 py-2 rounded-full border font-semibold transition-all"
              style={activeCategory === c
                ? { background:`linear-gradient(135deg,${P},${A})`, color:"white", borderColor:"transparent" }
                : { background:"white", color:"#4B5563", borderColor:"#E5E7EB" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)" }}>
            {activeCategory === "All" ? "All Reels" : activeCategory}
          </h2>
          <span className="text-sm text-gray-400">{filtered.length} videos</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clapperboard className="w-7 h-7 text-gray-400" strokeWidth={1.75}/>
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-2">No reels found</p>
            <p className="text-gray-400 text-sm mb-5">Try a different search or category</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-sm font-semibold hover:underline" style={{ color:P }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(r => <ReelCard key={r.id} reel={r} />)}
          </div>
        )}

        {/* Provider CTA */}
        <div className="mt-16 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background:"linear-gradient(135deg,oklch(0.96 0.02 262),oklch(0.93 0.04 285))", border:`1px solid oklch(0.90 0.06 262)` }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background:`linear-gradient(135deg,${P},${A})` }}>
              <Video className="w-6 h-6 text-white" strokeWidth={1.75}/>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)" }}>
                Are you a healthcare provider?
              </h3>
              <p className="text-gray-400 text-sm mt-0.5">
                Share expertise with thousands of members. Grow your practice with health reels.
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/provider-dashboard"
              className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-2xl font-bold hover:opacity-90 transition-opacity text-sm"
              style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
              Start Creating <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
            </Link>
            <Link href="/providers"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-sm">
              Browse Providers
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
