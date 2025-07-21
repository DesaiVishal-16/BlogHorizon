interface useDateType {
  dateInput: string;
  format?: string;
  locale?: string;
}

const useDate = ({
  dateInput,
  format = "DD-MM-YYYY",
  locale = "en-US",
}: useDateType): string => {
  const date = new Date(dateInput.trim());
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  const longMonth = date.toLocaleString(locale, { month: "long" });
  const shortMonth = date.toLocaleString(locale, { month: "short" });
  return format
    .replace(/DD/, day)
    .replace(/MM/, month)
    .replace(/YYYY/, year)
    .replace(/Month/, longMonth)
    .replace(/Mon/, shortMonth);
};

export default useDate;
