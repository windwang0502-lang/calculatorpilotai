// Age at Date Engine
export interface AgeAtDateResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  nextBirthday: {
    date: Date;
    daysUntil: number;
  };
  zodiacSign: string;
  ageInWeeks: number;
  ageInHours: number;
  ageInMinutes: number;
}

export const calculateAgeAtDate = (
  birthDate: Date,
  targetDate: Date
): AgeAtDateResult => {
  // Calculate basic age
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate next birthday
  let nextBirthdayYear = targetDate.getFullYear();
  let nextBirthdayDate = new Date(
    nextBirthdayYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (nextBirthdayDate <= targetDate) {
    nextBirthdayDate = new Date(
      nextBirthdayYear + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
  }

  const daysUntilBirthday = Math.floor(
    (nextBirthdayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate total days
  const totalDays = Math.floor(
    (targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate total months (approximate)
  const totalMonths = years * 12 + months;

  // Calculate age in weeks and hours
  const ageInWeeks = Math.floor(totalDays / 7);
  const ageInHours = totalDays * 24;
  const ageInMinutes = ageInHours * 60;

  // Calculate zodiac sign
  const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    nextBirthday: {
      date: nextBirthdayDate,
      daysUntil: daysUntilBirthday,
    },
    zodiacSign,
    ageInWeeks,
    ageInHours,
    ageInMinutes,
  };
};

const getZodiacSign = (month: number, day: number): string => {
  const signs = [
    { name: 'Capricorn', end: [1, 19] },
    { name: 'Aquarius', end: [2, 18] },
    { name: 'Pisces', end: [3, 20] },
    { name: 'Aries', end: [4, 19] },
    { name: 'Taurus', end: [5, 20] },
    { name: 'Gemini', end: [6, 20] },
    { name: 'Cancer', end: [7, 22] },
    { name: 'Leo', end: [8, 22] },
    { name: 'Virgo', end: [9, 22] },
    { name: 'Libra', end: [10, 22] },
    { name: 'Scorpio', end: [11, 21] },
    { name: 'Sagittarius', end: [12, 21] },
    { name: 'Capricorn', end: [12, 31] },
  ];

  for (const sign of signs) {
    if (month < sign.end[0] || (month === sign.end[0] && day <= sign.end[1])) {
      return sign.name;
    }
  }
  return 'Capricorn';
};
