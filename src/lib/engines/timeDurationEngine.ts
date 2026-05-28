// Time Duration Engine
export interface TimeDurationResult {
  resultDate: Date;
  resultDateString: string;
  resultTimeString: string;
  dayOfWeek: string;
  daysFromNow: number;
  hoursInResult: number;
}

export interface DurationInput {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeDuration = (
  baseDate: Date,
  duration: DurationInput,
  operation: 'add' | 'subtract'
): TimeDurationResult => {
  const result = new Date(baseDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerHour = 1000 * 60 * 60;
  const msPerMinute = 1000 * 60;
  const msPerSecond = 1000;

  let totalMs =
    duration.days * msPerDay +
    duration.hours * msPerHour +
    duration.minutes * msPerMinute +
    duration.seconds * msPerSecond;

  if (operation === 'subtract') {
    totalMs = -totalMs;
  }

  result.setTime(result.getTime() + totalMs);

  const now = new Date();
  const daysFromNow = Math.floor(
    (result.getTime() - now.getTime()) / msPerDay
  );

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[result.getDay()];

  return {
    resultDate: result,
    resultDateString: result.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    resultTimeString: result.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
    dayOfWeek,
    daysFromNow,
    hoursInResult: result.getHours(),
  };
};

export const convertTimeUnits = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
};
