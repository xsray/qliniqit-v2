import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft, CheckCircle2, Star, MapPin, Video, Shield, Globe2,
  Stethoscope, Clock, CreditCard, Search, ChevronRight, BadgeCheck,
  Zap, Building2, ShieldCheck,
} from "lucide-react";
import { trpc } from "../lib/trpc";
import BookingModal from "../components/BookingModal";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";

export default function ProviderDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showBooking, setShowBooking] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const { data, isLoading, isError } = trpc.providers.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const { data: reviews } = trpc.reviews.forProvider.useQuery(
    { providerId: data?.profile.id ?? 0, page: reviewPage, limit: 5 },
    { enabled: !!data?.profile.id }
  );

  const { data: similar } = trpc.providers.search.useQuery(
    { query: data?.specialtyName ?? "", limit: 4, page: 1 },
    { enabled: !!data?.specialtyName }
  );

  if (isLoading) return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24 mb-6" />
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  if (isError || !data) return (
    <main className="text-center py-24 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
        <Search className="w-7 h-7 text-gray-400" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Provider not found</h2>
      <p className="text-gray-400 text-sm mb-6">This provider may have been removed or the link is incorrect.</p>
      <Link href="/providers" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: P }}>
        <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Back to search
      </Link>
    </main>
  );

  const { profile, name, avatarUrl, trustScore, specialtyName } = data;
  const languages: string[] = Array.isArray(profile.languages)
    ? (profile.languages as string[])
    : typeof profile.languages === "string" && profile.languages
      ? (() => { try { return JSON.parse(profile.languages as string); } catch { return [profile.languages as string]; } })()
      : [];

  const similarFiltered = similar?.providers.filter(p => p.slug !== slug).slice(0, 3) ?? [];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {showBooking && (
        <BookingModal
          providerId={profile.id}
          providerName={name ?? "Provider"}
          consultationFee={profile.consultationFee ?? null}
          currencyCode={profile.currencyCode ?? null}
          offersVideo={profile.offersVideo ?? null}
          onClose={() => setShowBooking(false)}
        />
      )}

      <Link href="/providers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Back to search
      </Link>

      {/* ── Hero card ─────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-5 overflow-hidden">
        <div className="h-1" style={{ background: `linear-gradient(90deg,${P},${A})` }} />
        <div className="p-7">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name ?? ""} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-extrabold text-4xl text-white flex-shrink-0 shadow-sm"
                style={{ background: `linear-gradient(135deg,${P},${A})` }}>
                {(name ?? "?")[0]}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily:"var(--font-heading)" }}>{name}</h1>
                {profile.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> Verified
                  </span>
                )}
                {profile.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0} /> Featured
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-sm mb-1.5">
                {specialtyName && <span className="font-semibold text-gray-700">{specialtyName}</span>}
                {specialtyName && " · "}
                <span className="capitalize">{profile.providerType?.replace(/_/g, " ")}</span>
              </p>
              <p className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                {profile.city}{profile.countryCode ? `, ${profile.countryCode}` : ""}
              </p>

              <div className="flex flex-wrap gap-4 items-center mb-4">
                {profile.ratingAvg && (
                  <span className="flex items-center gap-1.5">
                    <StarRow count={Math.round(Number(profile.ratingAvg))} />
                    <span className="font-bold text-gray-800">{Number(profile.ratingAvg).toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({profile.reviewCount} reviews)</span>
                  </span>
                )}
                {profile.consultationFee && (
                  <span className="font-bold" style={{ color: P }}>
                    {profile.currencyCode ?? "USD"} {profile.consultationFee}
                    <span className="text-gray-400 font-normal text-sm"> / session</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.offersVideo && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background:"#f0eeff", color:P }}>
                    <Video className="w-3 h-3" strokeWidth={2} /> Video
                  </span>
                )}
                {trustScore && (
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium capitalize ${
                    trustScore.tier === "elite" ? "bg-purple-50 text-purple-700" :
                    trustScore.tier === "verified" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    <BadgeCheck className="w-3 h-3" strokeWidth={2} /> {trustScore.tier} tier
                  </span>
                )}
                {languages.slice(0, 3).map(l => (
                  <span key={l} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs border border-gray-100">
                    <Globe2 className="w-3 h-3" strokeWidth={2} /> {l}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowBooking(true)}
              className="flex-shrink-0 text-white px-7 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity text-sm shadow-lg"
              style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
              Book Appointment
            </button>
          </div>

          {profile.bio && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-700 mb-2">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail tiles ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          specialtyName && { label: "Specialty",    value: specialtyName,                                    Icon: Stethoscope },
          profile.cancellationWindowHours != null && { label: "Cancellation", value: `${profile.cancellationWindowHours}h notice`, Icon: Clock },
          languages.length > 0 && { label: "Languages",   value: languages.slice(0, 2).join(", "),             Icon: Globe2 },
          profile.consultationFee && { label: "Fee",         value: `${profile.currencyCode ?? "USD"} ${profile.consultationFee}`, Icon: CreditCard },
        ].filter(Boolean).map((item: any) => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-gray-400 text-xs mb-1.5">
              <item.Icon className="w-3.5 h-3.5" strokeWidth={2} style={{ color: A }} /> {item.label}
            </p>
            <p className="text-gray-800 text-sm font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Consultation type selector ─────────────────────── */}
      <ConsultationTypes
        fee={profile.consultationFee ?? null}
        currency={profile.currencyCode ?? "USD"}
        offersVideo={profile.offersVideo ?? false}
        onBook={() => setShowBooking(true)}
      />

      {/* ── Reviews ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-5">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily:"var(--font-heading)" }}>Member Reviews</h2>
          {!!profile.reviewCount && (
            <div className="flex items-center gap-1.5">
              <StarRow count={Math.round(Number(profile.ratingAvg ?? 0))} />
              <span className="font-semibold text-gray-700">{Number(profile.ratingAvg ?? 0).toFixed(1)}</span>
              <span className="text-gray-400 text-sm">· {profile.reviewCount} total</span>
            </div>
          )}
        </div>
        <div className="p-6">
          {!reviews?.length ? (
            <p className="text-gray-400 text-sm text-center py-8">No reviews yet — be the first to book and leave a review.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-2">
                    {r.patientAvatar ? (
                      <img src={r.patientAvatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background:`linear-gradient(135deg,${P},${A})` }}>
                        {(r.patientName ?? "?")[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">{r.patientName ?? "Anonymous"}</p>
                        <p className="text-xs text-gray-400">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short" }) : ""}
                        </p>
                      </div>
                      <div className="flex mt-0.5">
                        <StarRow count={r.rating ?? 0} dim={5 - (r.rating ?? 0)} />
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                  {r.aspects && typeof r.aspects === "object" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(r.aspects as Record<string, number>).map(([k, v]) => (
                        <span key={k} className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                          {k.replace(/([A-Z])/g, " $1").toLowerCase()}: {v}/5
                        </span>
                      ))}
                    </div>
                  )}
                  {r.providerResponse && (
                    <div className="mt-3 ml-4 border-l-2 pl-3" style={{ borderColor:`${P}/30%` }}>
                      <p className="text-xs font-semibold mb-0.5" style={{ color:P }}>Provider replied:</p>
                      <p className="text-sm text-gray-600">{r.providerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {reviews && reviews.length === 5 && (
            <div className="mt-5 text-center">
              <button onClick={() => setReviewPage(p => p + 1)}
                className="text-sm font-semibold hover:underline" style={{ color:P }}>
                Load more reviews →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Similar providers ─────────────────────────────── */}
      {similarFiltered.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-4" style={{ fontFamily:"var(--font-heading)" }}>Similar Providers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarFiltered.map(p => (
              <Link key={p.id} href={`/providers/${p.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${P},${A})` }}>
                    {(p.name ?? "?")[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" strokeWidth={2} /> {p.city}{p.countryCode ? `, ${p.countryCode}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
                  <span className="font-bold text-xs" style={{ color:P }}>{p.currencyCode ?? "USD"} {p.consultationFee}</span>
                  {p.ratingAvg && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0} /> {Number(p.ratingAvg).toFixed(1)} ({p.reviewCount})
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function ConsultationTypes({
  fee, currency, offersVideo, onBook,
}: {
  fee: string | null; currency: string; offersVideo: boolean; onBook: () => void;
}) {
  const [selected, setSelected] = useState<"standard" | "video" | "urgent">(offersVideo ? "video" : "standard");
  const baseFee = fee ? Number(fee) : null;

  const types = [
    ...(!offersVideo ? [{
      id: "standard" as const,
      label: "In-Clinic",
      icon: Building2,
      description: "Visit the provider in person at their clinic",
      responseTime: null,
      multiplier: 1,
      color: "oklch(0.47 0.22 262)",
      bg: "oklch(0.97 0.02 262)",
      insuranceCovered: true,
    }] : []),
    ...(offersVideo ? [{
      id: "video" as const,
      label: "Video Consult",
      icon: Video,
      description: "Secure HD video call from anywhere",
      responseTime: "Usually within 24 hours",
      multiplier: 1,
      color: "oklch(0.47 0.22 262)",
      bg: "oklch(0.97 0.02 262)",
      insuranceCovered: true,
    }] : []),
    {
      id: "urgent" as const,
      label: "Urgent Consult",
      icon: Zap,
      description: "Priority access — provider responds faster",
      responseTime: "Usually within 1 hour",
      multiplier: 1.75,
      color: "oklch(0.54 0.22 45)",
      bg: "oklch(0.98 0.06 65)",
      insuranceCovered: true,
    },
  ];

  const sel = types.find(t => t.id === selected) ?? types[0]!;
  const displayFee = baseFee ? (baseFee * sel.multiplier).toFixed(0) : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-5 overflow-hidden">
      <div className="p-5 border-b border-gray-50">
        <h2 className="font-bold text-gray-900 text-base mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Choose Consultation Type
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {types.map(t => {
            const isActive = selected === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                  isActive ? "shadow-md" : "border-gray-100 hover:border-gray-200"
                }`}
                style={isActive ? { borderColor: t.color, background: t.bg } : {}}
              >
                {t.id === "urgent" && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    PRIORITY
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: isActive ? t.color : "oklch(0.93 0.03 262)", }}>
                    <t.icon className="w-3.5 h-3.5" style={{ color: isActive ? "white" : t.color }} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-sm text-gray-900">{t.label}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2 leading-snug">{t.description}</p>
                {t.responseTime && (
                  <p className="flex items-center gap-1 text-xs font-semibold" style={{ color: t.color }}>
                    <Clock className="w-3 h-3" strokeWidth={2} /> {t.responseTime}
                  </p>
                )}
                {t.insuranceCovered && (
                  <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <ShieldCheck className="w-3 h-3" strokeWidth={2} /> Insurance accepted
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 flex items-center justify-between gap-4">
        <div>
          {displayFee ? (
            <>
              <p className="font-extrabold text-xl" style={{ color: sel.color }}>
                {currency} {displayFee}
              </p>
              {sel.id === "urgent" && baseFee && (
                <p className="text-xs text-gray-400">
                  Standard: {currency} {baseFee} · +75% urgent fee
                </p>
              )}
            </>
          ) : (
            <p className="font-bold text-gray-700">Fee on request</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">
            {sel.id === "urgent"
              ? "Guaranteed priority response"
              : sel.id === "video"
              ? "Secure encrypted video session"
              : "In-person at provider's clinic"}
          </p>
        </div>
        <button
          onClick={onBook}
          className="flex items-center gap-2 font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm flex-shrink-0 shadow-md text-white"
          style={{ background: `linear-gradient(135deg, ${sel.color}, oklch(0.35 0.20 262))` }}>
          {sel.id === "urgent" ? <Zap className="w-4 h-4" strokeWidth={2} /> : sel.id === "video" ? <Video className="w-4 h-4" strokeWidth={2} /> : null}
          {sel.id === "urgent" ? "Book Urgent →" : sel.id === "video" ? "Start Teleconsult →" : "Book Appointment →"}
        </button>
      </div>
    </div>
  );
}

function StarRow({ count, dim = 0 }: { count: number; dim?: number }) {
  return (
    <span className="flex gap-0.5">
      {[...Array(count)].map((_, i) => <Star key={`f${i}`} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />)}
      {[...Array(dim)].map((_, i)   => <Star key={`d${i}`} className="w-3.5 h-3.5 fill-gray-200 text-gray-200"   strokeWidth={0} />)}
    </span>
  );
}
