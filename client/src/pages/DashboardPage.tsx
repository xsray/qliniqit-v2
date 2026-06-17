import { Link } from "wouter";
import { CalendarDays, Bell, ClipboardList, LayoutDashboard } from "lucide-react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";
import { formatDate, formatTime } from "../lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { data: profile } = trpc.auth.me.useQuery(undefined, { enabled: !!user });
  const { data: dashboard } = trpc.patient.dashboard.useQuery(undefined, { enabled: !!user });
  const { data: appointments } = trpc.booking.myAppointments.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LayoutDashboard className="w-9 h-9 text-primary-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your health dashboard</h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Sign in to manage appointments, view your health history, and access your bookings.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="inline-block bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="inline-block border border-primary-600 text-primary-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
              Create Account — Free
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { Icon: CalendarDays, title: "Manage Appointments", desc: "View upcoming and past consultations. Cancel or reschedule anytime.", color: "bg-primary-50 text-primary-600" },
            { Icon: Bell,         title: "Smart Notifications",  desc: "Get reminders before your appointments and updates from your providers.", color: "bg-highlight-50 text-highlight-600" },
            { Icon: ClipboardList,title: "Health Records",       desc: "Keep track of prescriptions, diagnoses, and consultation notes in one place.", color: "bg-accent-50 text-accent-600" },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${f.color}`}>
                <f.Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
            {((profile?.name ?? user.email ?? "?")[0] ?? "?").toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, {profile?.name ?? user.email?.split("@")[0] ?? "there"}
          </h1>
          <p className="text-gray-500 text-sm capitalize">{profile?.role ?? "member"}</p>
        </div>
      </div>

      {/* Upcoming appointments */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
        {!dashboard?.upcomingAppointments?.length && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400">
            No upcoming appointments.{" "}
            <Link href="/providers" className="text-primary-600 hover:underline">Find a provider</Link>
          </div>
        )}
        <div className="space-y-3">
          {dashboard?.upcomingAppointments?.map((appt) => (
            <div key={appt.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{appt.providerName}</p>
                <p className="text-sm text-gray-500">
                  {appt.slotStart ? `${formatDate(appt.slotStart)} at ${formatTime(appt.slotStart)}` : "—"}
                  {" · "}<span className="capitalize">{appt.type?.replace("_", " ")}</span>
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                appt.status === "confirmed" ? "bg-green-50 text-green-700" :
                appt.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"
              }`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* All appointments */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All Appointments</h2>
        {!appointments?.length && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400">
            No appointments yet.
          </div>
        )}
        <div className="space-y-3">
          {appointments?.map((appt) => (
            <div key={appt.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {appt.providerAvatar ? (
                  <img src={appt.providerAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                    {(appt.providerName ?? "?")[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{appt.providerName}</p>
                  <p className="text-xs text-gray-500">
                    {appt.slotStart ? formatDate(appt.slotStart) : "—"}
                    {" · "}<span className="capitalize">{appt.type?.replace("_", " ")}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                  appt.status === "confirmed" ? "bg-green-50 text-green-700" :
                  appt.status === "completed" ? "bg-blue-50 text-blue-700" :
                  appt.status === "cancelled" ? "bg-red-50 text-red-600" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {appt.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  appt.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {appt.paymentStatus ?? "unpaid"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
