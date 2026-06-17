import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../lib/utils";
import { Tag, Star, Stethoscope, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, X, ArrowRight } from "lucide-react";

const P  = "oklch(0.47 0.22 262)";
const PD = "oklch(0.32 0.18 262)";
const A  = "oklch(0.54 0.24 290)";

export default function DealsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [claimedId, setClaimedId] = useState<number | null>(null);
  const [claimCode, setClaimCode] = useState<string | null>(null);

  const { data, isLoading } = trpc.deals.list.useQuery({ page, limit: 12 });
  const claimMutation = trpc.deals.claim.useMutation({
    onSuccess: (res) => setClaimCode(res.claimCode),
  });

  return (
    <div>
      {/* Hero */}
      <div className="relative text-white py-16 px-6 text-center overflow-hidden"
        style={{ background:`linear-gradient(145deg,${PD} 0%,${P} 55%,${A} 100%)` }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass text-white/70 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            <Tag className="w-3.5 h-3.5" strokeWidth={2}/> Limited-time Offers
          </div>
          <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)" }}>Healthcare Deals</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Exclusive discounts from verified providers. Save on consultations, check-ups, and more.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Claim success banner */}
        {claimCode && (
          <div className="mb-8 rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ background:"oklch(0.97 0.04 155)", border:"1px solid oklch(0.88 0.08 155)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2}/>
              </div>
              <div>
                <p className="font-bold text-green-800">Deal claimed successfully!</p>
                <p className="text-sm text-green-700 mt-0.5">
                  Your discount code:{" "}
                  <span className="font-mono font-bold bg-green-100 px-2 py-0.5 rounded">{claimCode}</span>
                  {" "}— present this when booking
                </p>
              </div>
            </div>
            <button onClick={() => setClaimCode(null)} className="text-green-400 hover:text-green-700 transition-colors flex-shrink-0">
              <X className="w-5 h-5" strokeWidth={2}/>
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse">
                <div className="h-36 bg-gray-100 rounded-2xl mb-4"/>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/>
                <div className="h-3 bg-gray-100 rounded w-full mb-1"/>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4"/>
                <div className="h-10 bg-gray-100 rounded-xl"/>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && data?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag className="w-7 h-7 text-gray-400" strokeWidth={1.75}/>
            </div>
            <p className="text-gray-700 font-semibold text-lg">No active deals right now</p>
            <p className="text-gray-400 text-sm mt-2 mb-6">Check back soon — new deals are added regularly</p>
            <Link href="/providers" className="text-sm font-semibold hover:underline" style={{ color:P }}>
              Browse providers instead
            </Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((deal) => {
            const savings = deal.originalPrice && deal.discountedPrice
              ? (Number(deal.originalPrice) - Number(deal.discountedPrice)).toFixed(0)
              : null;
            const claimed = claimMutation.isPending && claimedId === deal.id;

            return (
              <div key={deal.id}
                className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                {/* Image / placeholder */}
                {deal.imageUrl ? (
                  <img src={deal.imageUrl} alt={deal.title} className="w-full h-40 object-cover"/>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center"
                    style={{ background:`linear-gradient(145deg,${PD},${P})` }}>
                    <Stethoscope className="w-12 h-12 text-white/30" strokeWidth={1.5}/>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {deal.isFeatured && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0}/> Featured
                      </span>
                    )}
                    {deal.discountPct && (
                      <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-bold">
                        {deal.discountPct}% OFF
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{deal.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{deal.description}</p>

                  {deal.originalPrice && deal.discountedPrice && (
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-extrabold" style={{ color:P }}>
                        {deal.currency ?? "USD"} {Number(deal.discountedPrice).toFixed(0)}
                      </span>
                      <span className="text-gray-300 line-through text-sm">
                        {Number(deal.originalPrice).toFixed(0)}
                      </span>
                      {savings && (
                        <span className="text-green-600 text-sm font-semibold">Save {savings}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" strokeWidth={2}/>
                      Valid until {deal.validUntil ? formatDate(deal.validUntil) : "—"}
                    </span>
                    {deal.maxClaims !== null && (
                      <span className="text-orange-500 font-semibold">
                        {(deal.maxClaims ?? 0) - (deal.claimsCount ?? 0)} left
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!user) { window.location.href = "/login"; return; }
                      setClaimedId(deal.id);
                      claimMutation.mutate({ dealId: deal.id });
                    }}
                    disabled={claimed}
                    className="w-full text-white py-3 rounded-2xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
                    {claimed ? "Claiming…" : "Claim Deal"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {data && (data.length === 12 || page > 1) && (
          <div className="flex justify-center gap-3 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" strokeWidth={2}/> Previous
            </button>
            <span className="px-5 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl">Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={data.length < 12}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
              Next <ChevronRight className="w-4 h-4" strokeWidth={2}/>
            </button>
          </div>
        )}

        {/* Provider CTA */}
        <div className="mt-16 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background:"linear-gradient(135deg,oklch(0.96 0.02 262),oklch(0.93 0.04 285))", border:`1px solid oklch(0.90 0.06 262)` }}>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1" style={{ fontFamily:"var(--font-heading)" }}>
              Are you a healthcare provider?
            </h3>
            <p className="text-gray-400 text-sm">
              List your practice and offer exclusive deals to thousands of members worldwide.
            </p>
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
            Get Listed <ArrowRight className="w-4 h-4" strokeWidth={2.5}/>
          </Link>
        </div>
      </main>
    </div>
  );
}
