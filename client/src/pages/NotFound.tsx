import { Link } from "wouter";
import { Search, Home, Stethoscope, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      {/* 404 graphic */}
      <div className="relative mb-8 inline-block">
        <p className="text-[120px] font-extrabold text-gray-100 leading-none select-none" style={{ fontFamily: "var(--font-heading)" }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center shadow-sm">
            <Search className="w-9 h-9 text-primary-500" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
        Page not found
      </h1>
      <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Here are some helpful links to get you back on track.
      </p>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
        <Link
          href="/"
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group"
        >
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Home className="w-5 h-5 text-primary-600" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Go Home</p>
            <p className="text-xs text-gray-400 mt-0.5">Back to the homepage</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" strokeWidth={2} />
        </Link>

        <Link
          href="/providers"
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group"
        >
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-accent-600" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Find a Doctor</p>
            <p className="text-xs text-gray-400 mt-0.5">Browse verified providers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" strokeWidth={2} />
        </Link>
      </div>

      <p className="text-sm text-gray-400">
        Need help?{" "}
        <a href="mailto:support@qliniqit.com" className="text-primary-600 hover:underline font-medium">
          Contact support
        </a>
      </p>
    </main>
  );
}
