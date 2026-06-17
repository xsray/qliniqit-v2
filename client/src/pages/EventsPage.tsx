import { useState } from "react";
import {
  Mic2, Monitor, Building2, BookOpen, CalendarDays, MapPin, Users, Briefcase,
  Search, Star, CheckCircle2, X, ChevronLeft, ChevronRight, ArrowRight,
} from "lucide-react";
import { trpc } from "../lib/trpc";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";
const G  = "oklch(0.75 0.18 65)";

const TYPE_FILTERS = [
  { label: "All Events",    value: "",            Icon: CalendarDays },
  { label: "Conferences",   value: "conference",  Icon: Mic2 },
  { label: "Webinars",      value: "webinar",     Icon: Monitor },
  { label: "Health Fairs",  value: "health_fair", Icon: Building2 },
  { label: "Workshops",     value: "workshop",    Icon: BookOpen },
];

const TYPE_META: Record<string, { Icon: typeof Mic2; bg: string; text: string }> = {
  conference: { Icon: Mic2,      bg: "#EDE9FE", text: "#5B21B6" },
  webinar:    { Icon: Monitor,   bg: "#F0EEFF", text: P },
  health_fair:{ Icon: Building2, bg: "#D1FAE5", text: "#065F46" },
  workshop:   { Icon: BookOpen,  bg: "#FEF3C7", text: "#92400E" },
};

function formatEventDate(start: string, end?: string | null) {
  const opts: Intl.DateTimeFormatOptions = { month:"short", day:"numeric", year:"numeric" };
  const s = new Date(start).toLocaleDateString("en-US", opts);
  if (!end || end === start) return s;
  const startD = new Date(start);
  const endD   = new Date(end);
  if (startD.getFullYear() === endD.getFullYear() && startD.getMonth() === endD.getMonth()) {
    return `${new Date(start).toLocaleDateString("en-US",{month:"short",day:"numeric"})}–${endD.getDate()}, ${startD.getFullYear()}`;
  }
  return `${s} – ${new Date(end).toLocaleDateString("en-US",opts)}`;
}

/* ── Register modal ─────────────────────────────────────────────── */
function RegisterModal({ event, onClose }: { event:{id:number;title:string}; onClose:()=>void }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg]     = useState("");
  const [role, setRole]   = useState("");
  const [done, setDone]   = useState(false);

  const register = trpc.events.register.useMutation({ onSuccess: () => setDone(true) });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate({ eventId:event.id, name, email, organization:org||undefined, role:role||undefined });
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {done ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background:`linear-gradient(135deg,${P},${A})` }}>
              <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2" style={{ fontFamily:"var(--font-heading)" }}>You're registered!</h3>
            <p className="text-gray-400 text-sm mb-7">
              A confirmation has been sent to <strong>{email}</strong>. We'll remind you before the event.
            </p>
            <button onClick={onClose}
              className="text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
              style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg" style={{ fontFamily:"var(--font-heading)" }}>Register for Event</h3>
                <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{event.title}</p>
              </div>
              <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              {[
                { label:"Full name *", required:true, val:name, set:setName, ph:"Your name", type:"text" },
                { label:"Email *",    required:true, val:email,set:setEmail,ph:"you@example.com",type:"email" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                  <input required={f.required} type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ "--tw-ring-color": P } as React.CSSProperties} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Organisation", val:org, set:setOrg, ph:"Hospital / Clinic" },
                  { label:"Role",         val:role,set:setRole,ph:"e.g. Doctor" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": P } as React.CSSProperties} />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={register.isPending}
                className="w-full text-white py-3 rounded-2xl font-bold disabled:opacity-50 transition-opacity hover:opacity-90 mt-2"
                style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
                {register.isPending ? "Registering…" : "Register Now — Free"}
              </button>
              {register.error && <p className="text-red-500 text-sm text-center">{register.error.message}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [type, setType]   = useState("");
  const [page, setPage]   = useState(1);
  const [registerEvent, setRegisterEvent] = useState<{id:number;title:string}|null>(null);

  const { data, isLoading } = trpc.events.list.useQuery({ query:query||undefined, type:type||undefined, page, limit:12 });

  const featured = data?.filter(e => e.featured) ?? [];
  const rest     = data?.filter(e => !e.featured) ?? [];

  return (
    <div>
      {registerEvent && <RegisterModal event={registerEvent} onClose={() => setRegisterEvent(null)} />}

      {/* Hero */}
      <div className="relative text-white overflow-hidden py-16 px-6 text-center"
        style={{ background:`linear-gradient(145deg,${PD} 0%,${P} 55%,${A} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass text-white/70 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <CalendarDays className="w-3.5 h-3.5" strokeWidth={2}/> Global Healthcare Events
          </div>
          <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)" }}>
            Medical Conferences & Webinars
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Stay at the forefront of medicine. Discover conferences, webinars, and health summits worldwide.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(f => (
              <button key={f.value} onClick={() => { setType(f.value); setPage(1); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                style={type === f.value
                  ? { background:`linear-gradient(135deg,${P},${A})`, color:"white", borderColor:"transparent" }
                  : { background:"white", color:"#4B5563", borderColor:"#E5E7EB" }}>
                <f.Icon className="w-3.5 h-3.5" strokeWidth={2} /> {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input type="text" placeholder="Search events…" value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"/>
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2"/>
                <div className="h-3 bg-gray-100 rounded w-full mb-1"/>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-5"/>
                <div className="h-10 bg-gray-100 rounded-xl"/>
              </div>
            ))}
          </div>
        )}

        {/* Featured */}
        {!isLoading && featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={0} />
              <h2 className="text-lg font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)" }}>Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map(ev => <EventCard key={ev.id} event={ev} onRegister={setRegisterEvent} highlight />)}
            </div>
          </section>
        )}

        {/* All */}
        {!isLoading && rest.length > 0 && (
          <section>
            {featured.length > 0 && (
              <h2 className="text-lg font-extrabold text-gray-900 mb-5" style={{ fontFamily:"var(--font-heading)" }}>All Events</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(ev => <EventCard key={ev.id} event={ev} onRegister={setRegisterEvent} />)}
            </div>
          </section>
        )}

        {/* Empty */}
        {!isLoading && data?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-7 h-7 text-gray-400" strokeWidth={1.75} />
            </div>
            <p className="text-gray-700 font-semibold text-lg">No events found</p>
            <p className="text-gray-400 text-sm mt-2">Try a different filter or check back soon</p>
            <button onClick={() => { setQuery(""); setType(""); setPage(1); }}
              className="mt-5 text-sm font-semibold hover:underline" style={{ color:P }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {data && (data.length === 12 || page > 1) && (
          <div className="flex justify-center gap-3 mt-12">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" strokeWidth={2}/> Previous
            </button>
            <span className="px-5 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl">Page {page}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={data.length<12}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
              Next <ChevronRight className="w-4 h-4" strokeWidth={2}/>
            </button>
          </div>
        )}

        {/* Submit CTA */}
        <div className="mt-16 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background:"linear-gradient(135deg,oklch(0.96 0.02 262),oklch(0.93 0.04 285))", border:`1px solid oklch(0.90 0.06 262)` }}>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1" style={{ fontFamily:"var(--font-heading)" }}>
              Organising a medical event?
            </h3>
            <p className="text-gray-400 text-sm">
              List your conference or webinar and reach thousands of healthcare professionals worldwide.
            </p>
          </div>
          <button
            onClick={() => alert("Event submission coming soon — contact events@qliniqit.com")}
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
            Submit an Event <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
          </button>
        </div>
      </main>
    </div>
  );
}

/* ── Event card ─────────────────────────────────────────────────── */
function EventCard({
  event, onRegister, highlight = false,
}: {
  event: {
    id:number; title:string; type:string; organizer:string; location:string|null;
    country:string|null; countryCode:string|null; startDate:string; endDate:string|null;
    attendeeCount:number|null; seekingSponsors:boolean; description:string|null;
    featured:boolean; specialtyTags:string|null;
  };
  onRegister: (e:{id:number;title:string}) => void;
  highlight?: boolean;
}) {
  const meta = TYPE_META[event.type] ?? { Icon: CalendarDays, bg:"#F3F4F6", text:"#4B5563" };
  const TypeIcon = meta.Icon;
  const isOnline = event.location?.toLowerCase().includes("online");
  const isPast   = new Date(event.startDate) < new Date();
  const tags     = event.specialtyTags?.split(",").filter(Boolean) ?? [];

  const bandColors: Record<string,string> = {
    conference: `linear-gradient(90deg,${P},${A})`,
    webinar:    `linear-gradient(90deg,${A},oklch(0.54 0.20 310))`,
    workshop:   `linear-gradient(90deg,oklch(0.65 0.17 65),oklch(0.75 0.18 65))`,
    health_fair:`linear-gradient(90deg,oklch(0.46 0.17 155),oklch(0.36 0.14 155))`,
  };

  return (
    <div className={`bg-white border rounded-3xl flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 shadow-sm ${
      highlight ? "ring-1 ring-inset" : ""
    }`}
      style={highlight ? { borderColor:`oklch(0.85 0.08 262)`, ringColor:`oklch(0.90 0.06 262)` } : { borderColor:"#F3F4F6" }}>
      <div className="h-1" style={{ background: bandColors[event.type] ?? `linear-gradient(90deg,${P},${A})` }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background:meta.bg, color:meta.text }}>
            <TypeIcon className="w-3 h-3" strokeWidth={2}/> {event.type.replace("_"," ")}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-50 text-amber-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0}/> Featured
            </span>
          )}
          {event.seekingSponsors && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-green-50 text-green-700">
              <Briefcase className="w-3 h-3" strokeWidth={2}/> Sponsors welcome
            </span>
          )}
          {isPast && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-500">Past event</span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{event.title}</h3>

        {event.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{event.description}</p>
        )}

        <div className="space-y-1.5 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2}/>
            <span className="font-semibold">{formatEventDate(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2}/>
            <span>{event.location ?? "TBD"}</span>
            {event.country && !isOnline && <span className="text-gray-400">· {event.country}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2}/>
            <span className="text-gray-400 text-xs">{event.organizer}</span>
          </div>
          {(event.attendeeCount ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2}/>
              <span className="text-gray-400 text-xs">{event.attendeeCount?.toLocaleString()} expected attendees</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0,3).map(t => (
              <span key={t} className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full capitalize">
                {t.replace("-"," ")}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          {isPast ? (
            <div className="w-full text-center py-2.5 rounded-xl text-sm text-gray-400 border border-gray-100">
              Event has ended
            </div>
          ) : (
            <button
              onClick={() => onRegister({id:event.id, title:event.title})}
              className="w-full text-white py-2.5 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
              style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
              Register — Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
