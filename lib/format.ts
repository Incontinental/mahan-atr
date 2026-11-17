export function toman(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}
export function persianDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
}
export function safeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");
}
