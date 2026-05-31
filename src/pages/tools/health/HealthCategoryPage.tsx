import CategoryLandingPage from '../CategoryLandingPage';

const faqs = [
  { q: 'What is BMI and how is it calculated?', a: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It is calculated by dividing weight in kilograms by height in meters squared. Our calculator uses the standard BMI formula and provides personalized health insights based on your results.' },
  { q: 'How many calories should I eat per day?', a: 'Your daily calorie needs depend on your age, gender, weight, height, and activity level. Our calorie calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).' },
  { q: 'Is BMI an accurate measure of health?', a: 'BMI is a useful screening tool but has limitations. It does not distinguish between muscle and fat mass, so athletes may have high BMI despite low body fat. For a complete health picture, consider using BMI alongside body fat percentage and waist circumference.' },
  { q: 'How much protein do I need per day?', a: 'General guidelines suggest 0.8g of protein per kg of body weight for sedentary adults. Athletes and those building muscle may need 1.2-2.2g per kg. Our protein calculator provides personalized recommendations based on your goals.' },
  { q: 'How much water should I drink daily?', a: 'The commonly cited "8 glasses a day" rule is a simplification. Your optimal water intake depends on body weight, activity level, and climate. A better guideline is about 35ml per kg of body weight, adjusted for activity and heat.' },
  { q: 'Can AI health insights help me reach my goals?', a: 'Our AI health insights provide personalized context beyond raw numbers. They analyze your results against evidence-based guidelines and offer actionable recommendations tailored to your specific situation and goals.' },
];

export default function HealthCategoryPage() {
  return (
    <CategoryLandingPage
      category="health"
      intro="Track your health journey with precision. Our health calculators provide accurate body composition metrics, nutrition estimates, and personalized recommendations. Combined with AI insights, you get a complete picture of your health status and actionable steps forward."
      faqs={faqs}
    />
  );
}
