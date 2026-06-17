const STOP_KEYWORDS = ["stop", "cancel", "unsubscribe", "quit", "end"];
const START_KEYWORDS = ["start", "yes", "unstop"];

export function isStopMessage(body: string): boolean {
  return STOP_KEYWORDS.includes(body.trim().toLowerCase());
}

export function isStartMessage(body: string): boolean {
  return START_KEYWORDS.includes(body.trim().toLowerCase());
}
