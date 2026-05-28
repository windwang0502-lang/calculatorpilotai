// Date Difference Engine
export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  weeks: number;
}

export const calculateDateDifference = (
  startDate: Date,
  endDate: Date
): DateDifferenceResult => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  // Calculate years, months, days
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(totalDays / 7);

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    weeks,
  };
};
