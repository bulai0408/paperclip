import i18n from "../i18n";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

const formatterCache = new Map<string, Intl.RelativeTimeFormat>();

function getFormatter() {
  const language = i18n.resolvedLanguage ?? i18n.language ?? "en";
  let formatter = formatterCache.get(language);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(language, {
      numeric: "auto",
      style: "short",
    });
    formatterCache.set(language, formatter);
  }
  return formatter;
}

export function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";

  const elapsedSeconds = Math.round((now - then) / 1000);
  const absoluteSeconds = Math.abs(elapsedSeconds);
  const formatter = getFormatter();

  if (absoluteSeconds < MINUTE) return formatter.format(0, "second");
  if (absoluteSeconds < HOUR) return formatter.format(-Math.trunc(elapsedSeconds / MINUTE), "minute");
  if (absoluteSeconds < DAY) return formatter.format(-Math.trunc(elapsedSeconds / HOUR), "hour");
  if (absoluteSeconds < WEEK) return formatter.format(-Math.trunc(elapsedSeconds / DAY), "day");
  if (absoluteSeconds < MONTH) return formatter.format(-Math.trunc(elapsedSeconds / WEEK), "week");
  return formatter.format(-Math.trunc(elapsedSeconds / MONTH), "month");
}
