import { useState, useRef, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";

export default function NotificationsBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, refetch } = trpc.notifications.list.useQuery(
    { unreadOnly: false, limit: 15 },
    { enabled: !!user }
  );
  const markRead = trpc.notifications.markRead.useMutation({ onSuccess: () => refetch() });

  const unreadCount = data?.filter((n) => !n.readAt).length ?? 0;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {!data?.length && (
              <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
            )}
            {data?.map((n) => (
              <div
                key={n.id}
                onClick={() => { if (!n.readAt) markRead.mutate({ notificationId: n.id }); }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.readAt ? "bg-primary-50/40" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {!n.readAt && <span className="mt-1.5 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                  <div className={!n.readAt ? "" : "pl-4"}>
                    <p className="text-sm text-gray-800 font-medium">{n.title}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
