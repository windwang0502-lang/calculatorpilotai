// Countdown Engine
export interface CountdownResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isPast: boolean;
  percentageComplete?: number;
}

export const calculateCountdown = (
  fromDate: Date,
  toDate: Date,
  startDate?: Date
): CountdownResult => {
  const diffMs = toDate.getTime() - fromDate.getTime();
  const isPast = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const totalSeconds = Math.floor(absDiffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  let percentageComplete: number | undefined;
  if (startDate) {
    const totalDuration = toDate.getTime() - startDate.getTime();
    const elapsed = fromDate.getTime() - startDate.getTime();
    percentageComplete = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isPast,
    percentageComplete,
  };
};
