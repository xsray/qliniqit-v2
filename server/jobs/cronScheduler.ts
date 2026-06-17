import cron from "node-cron";
import { runAllReminders } from "./reminders";
import { expireRecordings } from "./expireRecordings";
import { runEventReminders } from "./eventReminders";
import { getDb } from "../db";
import { cronLogs } from "../../drizzle/schema";

async function logCron(jobName: string, fn: () => Promise<unknown>) {
  const start = Date.now();
  try {
    const result = await fn();
    await getDb().insert(cronLogs).values({
      jobName,
      status: "success",
      durationMs: Date.now() - start,
      result: result as Record<string, unknown>,
    });
  } catch (err: any) {
    console.error(`[cron/${jobName}]`, err);
    await getDb().insert(cronLogs).values({
      jobName,
      status: "error",
      durationMs: Date.now() - start,
      errorMessage: err.message,
    });
  }
}

export function startCronScheduler() {
  // Appointment reminders — every 15 minutes
  cron.schedule("*/15 * * * *", () => {
    logCron("appointment-reminders", runAllReminders);
  });

  // Event reminders — every hour
  cron.schedule("0 * * * *", () => {
    logCron("event-reminders", runEventReminders);
  });

  // Expire recordings — daily at 2am UTC
  cron.schedule("0 2 * * *", () => {
    logCron("expire-recordings", expireRecordings);
  });

  console.log("[cron] Scheduler started");
}
