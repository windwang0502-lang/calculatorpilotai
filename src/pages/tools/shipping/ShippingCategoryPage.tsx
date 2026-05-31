import CategoryLandingPage from '../CategoryLandingPage';

const faqs = [
  { q: 'What is dimensional weight (DIM weight)?', a: 'Dimensional weight is a pricing technique that carriers use to account for package volume. It is calculated by multiplying package dimensions and dividing by a DIM divisor. Carriers charge whichever is higher: actual weight or dimensional weight.' },
  { q: 'How do I reduce shipping costs?', a: 'Reduce package volume to lower DIM weight, compare carriers for each shipment, consider flat-rate options, optimize packaging to fit products snugly, and negotiate volume discounts if you ship regularly.' },
  { q: 'What is a freight class?', a: 'Freight class is a standardized classification system for LTL (Less-Than-Truckload) freight, ranging from 50 to 500. It is based on density, stowability, handling, and liability. Lower classes mean denser, easier-to-ship goods.' },
  { q: 'What is the DIM divisor for different carriers?', a: 'FedEx and UPS domestic ground use divisor 139. USPS Priority Mail uses divisor 166. International shipments often use different divisors. Always check your specific carrier\'s current guidelines.' },
  { q: 'How is chargeable weight calculated?', a: 'Chargeable weight is the greater of actual weight or dimensional weight for air freight, or the greater of actual weight and volumetric weight for ocean freight. Carriers always charge based on chargeable weight.' },
  { q: 'How can AI help with shipping decisions?', a: 'Our AI insights analyze your shipping patterns, suggest optimal carriers for your package types, warn about potential oversize charges, and provide cost optimization recommendations based on your shipping history.' },
];

export default function ShippingCategoryPage() {
  return (
    <CategoryLandingPage
      category="shipping"
      intro="Optimize your logistics with precision shipping calculators. From dimensional weight to freight class calculations, pallet planning to cost estimation — our tools help businesses and individuals ship smarter, faster, and more economically."
      faqs={faqs}
    />
  );
}
