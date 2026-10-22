import {
  differenceInSeconds,
  format,
  formatDistanceToNowStrict,
  isSameDay,
  isSameYear,
  isToday,
  isYesterday,
} from "date-fns";

// "now", "5m", "3h", "2d", then a date.
export function shortAgo(value) {
  const date = new Date(value);
  const seconds = differenceInSeconds(new Date(), date);
  if (seconds < 45) return "now";
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  if (seconds < 7 * 86400) return `${Math.round(seconds / 86400)}d`;
  return format(date, isSameYear(date, new Date()) ? "MMM d" : "MMM d, yyyy");
}

export function longAgo(value) {
  const date = new Date(value);
  if (differenceInSeconds(new Date(), date) < 45) return "Just now";
  if (differenceInSeconds(new Date(), date) < 7 * 86400) {
    return `${formatDistanceToNowStrict(date)} ago`;
  }
  return format(date, isSameYear(date, new Date()) ? "MMMM d 'at' h:mm a" : "MMMM d, yyyy");
}

export function dayLabel(value) {
  const date = new Date(value);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, isSameYear(date, new Date()) ? "EEEE, MMMM d" : "MMMM d, yyyy");
}

export const clock = (value) => format(new Date(value), "h:mm a");
export const sameDay = (a, b) => isSameDay(new Date(a), new Date(b));
export const fullDate = (value) => format(new Date(value), "MMMM d, yyyy");
