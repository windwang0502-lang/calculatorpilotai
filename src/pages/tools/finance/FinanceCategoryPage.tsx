import CategoryLandingPage from '../CategoryLandingPage';

const faqs = [
  { q: 'What is a mortgage calculator?', a: 'A mortgage calculator estimates your monthly home loan payment based on the home price, down payment, interest rate, and loan term. It helps you understand how much house you can afford and the total cost of your mortgage over time.' },
  { q: 'How is mortgage interest calculated?', a: 'Mortgage interest is calculated monthly based on your remaining loan balance. Early in the loan, more of your payment goes to interest; later, more goes to principal. Our calculator uses the standard amortization formula to show this breakdown.' },
  { q: 'What is the difference between 15-year and 30-year mortgages?', a: 'A 15-year mortgage has higher monthly payments but saves significantly on total interest over the life of the loan. A 30-year mortgage offers lower payments but costs more in total interest.' },
  { q: 'How much should I put down on a house?', a: 'A 20% down payment is traditionally recommended to avoid private mortgage insurance (PMI). However, many buyers put down 3-5% with FHA loans or other low-down-payment programs. The ideal down payment depends on your financial situation and loan type.' },
  { q: 'What is PMI and when do I need it?', a: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It protects the lender if you default. PMI typically costs 0.5-1% of the loan amount annually.' },
  { q: 'How do I get the best mortgage rate?', a: 'To get the best rate, maintain a good credit score (740+), save for a larger down payment, compare offers from multiple lenders, and consider locking your rate if rates are favorable during your application process.' },
];

export default function FinanceCategoryPage() {
  return (
    <CategoryLandingPage
      intro="Make informed financial decisions with our suite of finance calculators. From mortgage payments to loan calculations, debt payoff strategies to compound interest growth — our AI-enhanced tools help you plan for your financial future with confidence."
      faqs={faqs}
    />
  );
}
