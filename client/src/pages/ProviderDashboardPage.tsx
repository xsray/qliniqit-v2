import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";
import { formatDate, formatTime } from "../lib/utils";
import { CheckCircle2, Video } from "lucide-react";

export default function ProviderDashboardPage() {
  const { user, loading } = useAuth();
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [offersVideo, setOffersVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: profile } = trpc.auth.me.useQuery(undefined, { enabled: !!user });
  const { data: appointments, refetch } = trpc.booking.myAppointments.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );
  const cancelMutation = trpc.booking.cancel.useMutation({ onSuccess: () => refetch() });
  const updateProfile = trpc.providers.updateProfile.useMutation({
    onSuccess: () => { setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2500); },
    onError: () => setSaving(false),
  });

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>;

  if (!user || (profile && profile.role !== "provider" && profile.role !== "admin")) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Provider access only</h1>
        <p className="text-gray-500 mb-6">This page is for healthcare providers.</p>
        <Link href="/dashboard" className="text-primary-600 hover:underline">Go to member dashboard</Link>
      </main>
    );
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    updateProfile.mutate({
      bio: bio || undefined,
      consultationFee: fee || undefined,
      currencyCode: currency || undefined,
      offersVideo,
    });
  }

  const pending = appointments?.filter((a) => a.status === "pending") ?? [];
  const upcoming = appointments?.filter((a) => a.status === "confirmed" && a.slotStart && new Date(a.slotStart) >= new Date()) ?? [];
  const past = appointments?.filter((a) => ["completed", "cancelled", "no_show"].includes(a.status ?? "")) ?? [];

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Provider Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Pending", count: pending.length, color: "amber" },
          { label: "Upcoming", count: upcoming.length, color: "teal" },
          { label: "Completed / Past", count: past.length, color: "gray" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
            <p className={`text-3xl font-bold mb-1 ${
              s.color === "amber" ? "text-amber-600" : s.color === "teal" ? "text-primary-600" : "text-gray-600"
            }`}>{s.count}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending appointments — needs action */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Pending — Needs Confirmation</h2>
          <div className="space-y-3">
            {pending.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appt={appt}
                onCancel={(id) => cancelMutation.mutate({ appointmentId: id, reason: "Provider cancelled" })}
                cancelling={cancelMutation.isPending}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming confirmed */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appt={appt}
                onCancel={(id) => cancelMutation.mutate({ appointmentId: id, reason: "Provider cancelled" })}
                cancelling={cancelMutation.isPending}
              />
            ))}
          </div>
        </section>
      )}

      {/* Update profile */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Update Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Describe your experience, specialties, approach…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation fee</label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. 50.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {["USD", "EUR", "GBP", "JOD", "AED", "SAR", "EGP", "TRY"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={offersVideo}
              onChange={(e) => setOffersVideo(e.target.checked)}
              className="w-4 h-4 accent-violet-600"
            />
            <span className="text-sm text-gray-700">Offer video consultations</span>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}

function AppointmentRow({ appt, onCancel, cancelling }: {
  appt: { id: number; slotStart?: Date | null; type?: string | null; status?: string | null; providerName?: string | null; providerAvatar?: string | null; paymentStatus?: string | null };
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900 text-sm">
          {appt.slotStart ? `${formatDate(appt.slotStart)} at ${formatTime(appt.slotStart)}` : "—"}
        </p>
        <p className="text-xs text-gray-500 capitalize mt-0.5">{appt.type?.replace("_", " ")}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
          appt.status === "confirmed" ? "bg-green-50 text-green-700" :
          appt.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"
        }`}>{appt.status}</span>
        {["pending", "confirmed"].includes(appt.status ?? "") && (
          <button
            onClick={() => onCancel(appt.id)}
            disabled={cancelling}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
