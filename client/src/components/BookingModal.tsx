import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

interface Props {
  providerId: number;
  providerName: string;
  consultationFee: string | null;
  currencyCode: string | null;
  offersVideo: boolean | null;
  onClose: () => void;
}

function getDatesAhead(n: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function BookingModal({ providerId, providerName, consultationFee, currencyCode, offersVideo, onClose }: Props) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const dates = getDatesAhead(14);
  const [selectedDate, setSelectedDate] = useState(dates[0]!);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [type, setType] = useState<"in_clinic" | "teleconsultation">("in_clinic");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"pick" | "confirm" | "done">("pick");
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  const { data: slots, isLoading: slotsLoading } = trpc.providers.getAvailability.useQuery(
    { providerId, date: selectedDate },
    { enabled: !!selectedDate }
  );

  const holdMutation = trpc.booking.holdSlot.useMutation();
  const bookMutation = trpc.booking.create.useMutation({
    onSuccess: (res) => {
      setAppointmentId(res.appointmentId);
      setStep("done");
    },
  });

  const [holdId, setHoldId] = useState<number | null>(null);
  const [holdExpiry, setHoldExpiry] = useState<Date | null>(null);

  async function handleSelectSlot(slot: { start: string; end: string }) {
    if (!user) { navigate("/login"); return; }

    setSelectedSlot(slot);
    const slotStart = new Date(`${selectedDate}T${slot.start}:00Z`).toISOString();
    const slotEnd   = new Date(`${selectedDate}T${slot.end}:00Z`).toISOString();

    try {
      const hold = await holdMutation.mutateAsync({ providerId, slotStart, slotEnd });
      setHoldId(hold.holdId);
      setHoldExpiry(new Date(hold.expiresAt));
      setStep("confirm");
    } catch (err: any) {
      alert(err.message ?? "Could not hold slot — it may have just been taken.");
    }
  }

  async function handleConfirm() {
    if (!holdId || !selectedSlot) return;
    const slotStart = new Date(`${selectedDate}T${selectedSlot.start}:00Z`).toISOString();
    const slotEnd   = new Date(`${selectedDate}T${selectedSlot.end}:00Z`).toISOString();

    bookMutation.mutate({
      holdId,
      providerId,
      slotStart,
      slotEnd,
      type,
      notes: notes || undefined,
    });
  }

  const formatDay = (d: string) => {
    const date = new Date(d + "T12:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Book Appointment</h2>
            <p className="text-sm text-gray-500">{providerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">

          {/* Step: Pick slot */}
          {step === "pick" && (
            <>
              {/* Date strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {dates.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      selectedDate === d
                        ? "bg-primary-600 text-white border-primary-600"
                        : "border-gray-200 text-gray-600 hover:border-primary-400"
                    }`}
                  >
                    {formatDay(d)}
                  </button>
                ))}
              </div>

              {/* Slots */}
              {slotsLoading && <p className="text-center text-gray-400 py-8">Loading availability…</p>}
              {!slotsLoading && (!slots || slots.length === 0) && (
                <p className="text-center text-gray-400 py-8">No availability on this day.</p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {slots?.map((slot) => (
                  <button
                    key={slot.start}
                    disabled={!slot.available || holdMutation.isPending}
                    onClick={() => handleSelectSlot(slot)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      !slot.available
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : "border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-400"
                    }`}
                  >
                    {slot.start}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && selectedSlot && (
            <div className="space-y-5">
              <div className="bg-primary-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-primary-800 mb-1">Slot held for 10 minutes</p>
                {holdExpiry && (
                  <p className="text-primary-600">Expires at {holdExpiry.toLocaleTimeString()}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium">{providerName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{formatDay(selectedDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot.start} – {selectedSlot.end}</span></div>
                {consultationFee && (
                  <div className="flex justify-between"><span className="text-gray-500">Fee</span><span className="font-medium">{currencyCode ?? "USD"} {consultationFee}</span></div>
                )}
              </div>

              {offersVideo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment type</label>
                  <div className="flex gap-3">
                    {(["in_clinic", "teleconsultation"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          type === t ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 text-gray-600 hover:border-primary-400"
                        }`}
                      >
                        {t === "in_clinic" ? "In clinic" : "Video call"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for the provider <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Symptoms, reason for visit…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("pick")} className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={bookMutation.isPending}
                  className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {bookMutation.isPending ? "Booking…" : "Confirm Booking"}
                </button>
              </div>
              {bookMutation.isError && (
                <p className="text-red-600 text-sm text-center">{(bookMutation.error as any)?.message ?? "Booking failed."}</p>
              )}
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Requested!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your appointment with <strong>{providerName}</strong> on <strong>{formatDay(selectedDate)}</strong> at <strong>{selectedSlot?.start}</strong> is pending confirmation.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="border border-gray-300 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">Close</button>
                <button onClick={() => { onClose(); navigate("/dashboard"); }}
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                  View in Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
