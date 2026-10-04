export type WaitStatus = "pending" | "invited" | "rejected";

export const STATUS_LABEL: Record<WaitStatus, string> = {
  pending: "در انتظار",
  invited: "دعوت‌شده",
  rejected: "ردشده",
};

export const USE_OPTIONS = [
  { value: "team", label: "تیم محصول و فنی" },
  { value: "education", label: "آموزش و دوره‌ها" },
  { value: "support", label: "پشتیبانی مشتری" },
  { value: "sales", label: "فروش و جذب مشتری" },
  { value: "freelance", label: "فریلنسر یا کار مستقل" },
  { value: "other", label: "سایر" },
] as const;

export const USE_LABEL: Record<string, string> = Object.fromEntries(USE_OPTIONS.map((o) => [o.value, o.label]));

/** Waitlist size shown on the landing page only once it is big enough not to look empty. */
export const SHOW_COUNT_FROM = 10;
