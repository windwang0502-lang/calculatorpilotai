import CategoryLandingPage from '../CategoryLandingPage';

const faqs = [
  { q: 'How does the age calculator work?', a: 'Our age calculator converts both dates to a common reference and calculates the precise difference, accounting for leap years and varying month lengths. It provides results in years, months, and days for precision.' },
  { q: 'How are business days calculated?', a: 'Business days exclude Saturdays and Sundays. Optionally, you can also exclude public holidays. Our calculator automatically accounts for these exclusions when computing business day differences.' },
  { q: 'What is the difference between date difference and time duration?', a: 'Date difference calculates spans between two dates (e.g., how many days until your birthday). Time duration calculates spans between two times within a single day (e.g., how long is your work shift).' },
  { q: 'Can I create countdowns to future events?', a: 'Yes! Our countdown calculator lets you set any target date and see the remaining time in days, hours, minutes, and seconds. Perfect for counting down to birthdays, holidays, or project deadlines.' },
  { q: 'How accurate are the calculations?', a: 'Our calculators are leap-year-aware and use precise date arithmetic. They account for the varying number of days in each month and correctly handle century years (e.g., 2000 was a leap year, 1900 was not).' },
  { q: 'Can I calculate age at a specific future date?', a: 'Yes! The Age at Date calculator shows how old someone will be on any future date. This is useful for determining eligibility for age-restricted activities or planning milestone celebrations.' },
];

export default function TimeCategoryPage() {
  return (
    <CategoryLandingPage
      intro="Master time calculations with precision tools. Whether you need to calculate exact ages, count down to special events, or determine business day deadlines, our time calculators deliver accurate results with clear, easy-to-understand breakdowns."
      faqs={faqs}
    />
  );
}
