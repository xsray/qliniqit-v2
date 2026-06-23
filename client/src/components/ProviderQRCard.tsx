import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { Download, Printer } from "lucide-react";
import Logo from "./Logo";

interface Props {
  slug: string;
  name: string;
  specialty?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  verified?: boolean;
}

const APP_URL = import.meta.env.VITE_APP_URL ?? "https://www.qliniqit.com";

export default function ProviderQRCard({ slug, name, specialty, avatarUrl, city, verified }: Props) {
  const profileUrl = `${APP_URL}/provider/${slug}`;
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const card = cardRef.current;
    if (!card) return;
    const win = window.open("", "_blank", "width=600,height=800");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Qliniqit — ${name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          </style>
        </head>
        <body>${card.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  function handleDownload() {
    const card = cardRef.current;
    if (!card) return;
    const svgEl = card.querySelector("svg");
    if (!svgEl) return;
    const data = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qliniqit-qr-${slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Printable card */}
      <div
        ref={cardRef}
        style={{
          width: 340,
          background: "linear-gradient(160deg, #0f1e3d 0%, #1a3a6e 60%, #0d2b5e 100%)",
          borderRadius: 20,
          padding: "28px 24px 24px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(99,179,237,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(99,179,237,0.05)", pointerEvents: "none" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Logo size={28} full white />
          {verified && (
            <span style={{ marginLeft: "auto", background: "rgba(34,197,94,0.15)", color: "#4ade80",
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              border: "1px solid rgba(74,222,128,0.25)" }}>
              ✓ Verified
            </span>
          )}
        </div>

        {/* Provider info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name}
              style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)" }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.2)" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: 20 }}>
                {name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 16, lineHeight: 1.2,
              letterSpacing: "-0.3px" }}>{name}</p>
            {specialty && (
              <p style={{ color: "rgba(147,197,253,0.9)", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
                {specialty}
              </p>
            )}
            {city && (
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 }}>📍 {city}</p>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <QRCodeSVG
              value={profileUrl}
              size={150}
              level="H"
              includeMargin={false}
              fgColor="#0f1e3d"
            />
          </div>
        </div>

        {/* CTA text */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>
            Scan to book an appointment
          </p>
          <p style={{ color: "rgba(147,197,253,0.7)", fontSize: 11, wordBreak: "break-all" }}>
            {profileUrl}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "0 0 14px" }} />

        {/* Footer */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center",
          letterSpacing: "0.3px" }}>
          www.qliniqit.com — Book trusted healthcare providers online
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow: "0 2px 12px rgba(37,99,235,0.35)" }}
        >
          <Printer className="w-4 h-4" /> Print card
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
        Print this card and place it on your clinic door so patients can scan &amp; book instantly.
      </p>
    </div>
  );
}
