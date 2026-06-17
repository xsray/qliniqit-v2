import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { Bot, Send, Stethoscope, Zap, Shield, ArrowRight } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

const SUGGESTIONS = [
  "What are symptoms of type 2 diabetes?",
  "I have a headache and fever — what could it be?",
  "How often should I get a colonoscopy?",
  "What does a cardiologist treat?",
  "Is chest pain always a heart attack?",
  "What vitamins should I take daily?",
];

const EXAMPLE_RESPONSES: Record<string, string> = {
  default: `I'm your AI health assistant. I can help you understand symptoms, explain medical terms, suggest which specialist to see, and answer general health questions.

**Important:** I provide general health information only — not medical diagnoses. Always consult a qualified healthcare provider for personal medical advice.

What can I help you with today?`,

  symptoms: `Based on the symptoms you've described, here are some possibilities to discuss with your doctor:

**Common causes:**
• Viral infections (cold, flu, COVID-19)
• Bacterial infections
• Inflammatory conditions
• Stress and fatigue

**When to seek immediate care:**
🚨 High fever (above 39.4°C / 103°F)
🚨 Difficulty breathing
🚨 Severe headache with stiff neck
🚨 Chest pain

**Recommended specialist:** General Practitioner (GP) for initial evaluation.

Would you like me to help you find a GP in your area?`,

  diabetes: `**Type 2 Diabetes — Key Information**

**Common symptoms:**
• Increased thirst and frequent urination
• Fatigue and blurred vision
• Slow-healing wounds
• Tingling in hands/feet
• Unexplained weight loss

**Risk factors:**
• Being overweight (BMI > 25)
• Physical inactivity
• Family history
• Age 45+
• High blood pressure

**Diagnosis:** Fasting blood sugar test, HbA1c test

**Recommended specialist:** Endocrinologist or your GP can screen for diabetes.

Would you like to book an endocrinologist on Qliniqit?`,

  cardiologist: `**What Does a Cardiologist Treat?**

Cardiologists specialise in heart and cardiovascular conditions, including:

**Conditions:**
• Coronary artery disease
• Heart failure
• Arrhythmias (irregular heartbeat)
• Hypertension (high blood pressure)
• Valvular heart disease
• Heart attack (after emergency care)

**Common procedures:**
• Echocardiogram (heart ultrasound)
• Stress tests
• Holter monitoring
• Cardiac catheterisation

**When to see a cardiologist:**
• Chest pain or tightness
• Shortness of breath
• Palpitations
• Family history of heart disease
• High cholesterol or blood pressure

We have cardiology specialists available on Qliniqit — shall I show you some?`,
};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("diabetes") || lower.includes("blood sugar")) return EXAMPLE_RESPONSES.diabetes;
  if (lower.includes("cardiolog") || lower.includes("heart")) return EXAMPLE_RESPONSES.cardiologist;
  if (lower.includes("symptom") || lower.includes("headache") || lower.includes("fever") || lower.includes("pain") || lower.includes("could it be")) return EXAMPLE_RESPONSES.symptoms;
  return `Thank you for your question about **"${text}"**.

Based on your query, I'd recommend speaking with a healthcare provider for a personalised assessment. General health information can be a useful starting point, but your specific situation may require professional evaluation.

**Quick tips:**
• Track your symptoms with dates and severity
• Note any medications you're currently taking
• Bring a list of questions to your appointment

Would you like me to help you find the right specialist on Qliniqit?`;
}

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-bold text-gray-900 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("• ")) {
      return <li key={i} className="ml-4 list-disc text-gray-600 text-sm leading-relaxed">{line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
    }
    if (line.startsWith("🚨 ")) {
      return <p key={i} className="text-red-500 text-sm font-medium">{line}</p>;
    }
    if (line === "") return <div key={i} className="h-1.5" />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-gray-700 text-sm leading-relaxed">
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part)}
      </p>
    );
  });
}

export default function AiAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: EXAMPLE_RESPONSES.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim(), timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", text: getResponse(text), timestamp: new Date() }]);
      setThinking(false);
    }, 1200 + Math.random() * 800);
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); send(input); }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* ── Hero header ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 py-12"
        style={{ background: "linear-gradient(145deg, oklch(0.22 0.18 262) 0%, oklch(0.32 0.22 262) 45%, oklch(0.38 0.26 285) 100%)" }}
      >
        {/* Orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.54 0.24 290 / 0.22) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-10 left-1/4 w-60 h-60 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 65 / 0.08) 0%, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Animated icon */}
          <div className="relative inline-flex mb-6">
            <div className="absolute -inset-4 rounded-full animate-pulse"
              style={{ background: "radial-gradient(circle, oklch(0.54 0.24 290 / 0.25) 0%, transparent 70%)" }} />
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center relative shadow-2xl"
              style={{ background: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" }}>
              <Bot className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 mb-4 glass text-white/80 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5 text-highlight-300" strokeWidth={2.5} />
            AI-Powered · Free to Use
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            AI Health Assistant
          </h1>
          <p className="text-white/55 max-w-md mx-auto leading-relaxed">
            Ask about symptoms, conditions, medications, or find the right specialist. Powered by medical knowledge, available 24/7.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            {[
              { Icon: Stethoscope, text: "Specialist guidance" },
              { Icon: Shield,      text: "Privacy first" },
              { Icon: Zap,         text: "Instant answers" },
            ].map(({ Icon, text }) => (
              <div key={text} className="glass flex items-center gap-1.5 text-white/70 text-xs font-medium px-4 py-2 rounded-full">
                <Icon className="w-3.5 h-3.5 text-highlight-300" strokeWidth={2} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chat area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6 gap-4"
        style={{ background: "linear-gradient(180deg, oklch(0.97 0.015 285) 0%, #fff 30%)" }}>

        {/* Suggestion chips */}
        {messages.length === 1 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs font-medium px-4 py-2 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: "white",
                    borderColor: "oklch(0.84 0.10 290)",
                    color: "oklch(0.46 0.23 290)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.background = "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))";
                    el.style.color = "white";
                    el.style.borderColor = "transparent";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.background = "white";
                    el.style.color = "oklch(0.46 0.23 290)";
                    el.style.borderColor = "oklch(0.84 0.10 290)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              {msg.role === "assistant" ? (
                <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" }}>
                  <Bot className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" strokeWidth={1.75} />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
                  {(user?.email?.[0]?.toUpperCase()) ?? "U"}
                </div>
              )}

              {/* Bubble */}
              {msg.role === "assistant" ? (
                <div className="max-w-[82%] bg-white rounded-3xl rounded-tl-lg px-5 py-4 shadow-sm border border-gray-100">
                  <div className="leading-relaxed space-y-0.5">
                    {renderMarkdown(msg.text)}
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ) : (
                <div className="max-w-[82%] rounded-3xl rounded-tr-lg px-5 py-4 text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className="text-xs text-white/40 mt-2">
                    {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {thinking && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" }}>
                <Bot className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
              </div>
              <div className="bg-white rounded-3xl rounded-tl-lg px-5 py-4 shadow-sm border border-gray-100">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "oklch(0.54 0.24 290)", animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Find a Doctor CTA */}
        {messages.length >= 3 && (
          <div className="rounded-2xl p-4 flex items-center justify-between gap-4 border"
            style={{ background: "linear-gradient(135deg, oklch(0.97 0.02 262), oklch(0.94 0.04 285))", borderColor: "oklch(0.84 0.10 262)" }}>
            <div>
              <p className="text-sm font-bold" style={{ color: "oklch(0.32 0.18 262)" }}>Ready to speak to a real doctor?</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.47 0.22 262 / 0.7)" }}>Book a verified specialist on Qliniqit</p>
            </div>
            <Link href="/providers"
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity shadow-md"
              style={{ background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))" }}>
              Find a Doctor <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question…"
              disabled={thinking}
              className="w-full border-2 rounded-2xl px-5 py-3.5 text-sm focus:outline-none bg-white shadow-sm placeholder-gray-300 disabled:opacity-50 transition-all"
              style={{
                borderColor: "oklch(0.90 0.04 262)",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "oklch(0.54 0.24 290)"}
              onBlur={e => e.currentTarget.style.borderColor = "oklch(0.90 0.04 262)"}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl text-white text-sm disabled:opacity-40 transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md"
            style={{ background: "linear-gradient(135deg, oklch(0.54 0.24 290), oklch(0.38 0.22 310))" }}
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            Send
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 pb-2">
          AI responses are for informational purposes only and do not constitute medical advice.
        </p>
      </div>
    </div>
  );
}
