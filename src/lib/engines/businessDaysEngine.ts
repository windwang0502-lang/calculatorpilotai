// Business Days Engine
export interface BusinessDaysResult {
  totalDays: number;
  businessDays: number;
  weekends: number;
  holidays: number;
  workingWeeks: number;
  projectDurationDays: number;
}

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const getUSFederalHolidays = (year: number): Date[] => {
  const holidays: Date[] = [];

  // New Year's Day (January 1, or observed)
  const newYear = new Date(year, 0, 1);
  holidays.push(newYear);

  // MLK Day (Third Monday of January)
  const mlkDate = getNthWeekdayOfMonth(year, 0, 1, 3);
  holidays.push(mlkDate);

  // Presidents Day (Third Monday of February)
  const presidentsDate = getNthWeekdayOfMonth(year, 1, 1, 3);
  holidays.push(presidentsDate);

  // Memorial Day (Last Monday of May)
  const memorialDate = getLastWeekdayOfMonth(year, 4, 1);
  holidays.push(memorialDate);

  // Independence Day (July 4)
  const july4 = new Date(year, 6, 4);
  holidays.push(july4);

  // Labor Day (First Monday of September)
  const laborDate = getNthWeekdayOfMonth(year, 8, 1, 1);
  holidays.push(laborDate);

  // Columbus Day (Second Monday of October)
  const columbusDate = getNthWeekdayOfMonth(year, 9, 1, 2);
  holidays.push(columbusDate);

  // Veterans Day (November 11)
  const veterans = new Date(year, 10, 11);
  holidays.push(veterans);

  // Thanksgiving (Fourth Thursday of November)
  const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4);
  holidays.push(thanksgiving);

  // Christmas (December 25)
  const christmas = new Date(year, 11, 25);
  holidays.push(christmas);

  return holidays;
};

const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, n: number): Date => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let dayOffset = weekday - firstWeekday;
  if (dayOffset < 0) dayOffset += 7;
  const day = 1 + dayOffset + (n - 1) * 7;
  return new Date(year, month, day);
};

const getLastWeekdayOfMonth = (year: number, month: number, weekday: number): Date => {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  let dayOffset = lastWeekday - weekday;
  if (dayOffset < 0) dayOffset += 7;
  const day = lastDay.getDate() - dayOffset;
  return new Date(year, month, day);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const calculateBusinessDays = (
  startDate: Date,
  endDate: Date,
  excludeHolidays: boolean = false,
  customHolidays: Date[] = []
): BusinessDaysResult => {
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  let businessDays = 0;
  let weekends = 0;
  let holidays = 0;

  // Get holidays to exclude
  let holidaysToExclude: Date[] = [];
  if (excludeHolidays) {
    holidaysToExclude = [...customHolidays];
    // Add US federal holidays
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
      holidaysToExclude.push(...getUSFederalHolidays(year));
    }
  }

  // Count each day
  const current = new Date(startDate);
  for (let i = 0; i < totalDays; i++) {
    if (isWeekend(current)) {
      weekends++;
    } else {
      // Check if it's a holiday
      const isHoliday = holidaysToExclude.some(h => isSameDay(current, h));
      if (isHoliday) {
        holidays++;
      } else {
        businessDays++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  const workingWeeks = Math.floor(businessDays / 5);
  const projectDurationDays = businessDays;

  return {
    totalDays,
    businessDays,
    weekends,
    holidays,
    workingWeeks,
    projectDurationDays,
  };
};
