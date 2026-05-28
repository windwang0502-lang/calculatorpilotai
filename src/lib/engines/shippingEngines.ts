// Shipping calculation engines
// Pure functions for all shipping-related calculations

export interface FreightClassResult {
  cubicFeet: number;
  density: number;
  freightClass: string;
  freightClassNum: number;
  explanation: string;
}

// Constants for unit conversions
const CM_PER_IN = 2.54;
const IN_PER_CM = 1 / CM_PER_IN;
const KG_PER_LB = 0.453592;
const LB_PER_KG = 1 / KG_PER_LB;
const IN3_PER_FT3 = 1728;
const IN3_PER_CM3 = 0.0610237;
const CM3_PER_M3 = 1e6;

export const calculateFreightClass = (
  length: number,
  width: number,
  height: number,
  unit: 'in' | 'cm',
  weight: number,
  weightUnit: 'lb' | 'kg'
): FreightClassResult => {
  // Validate inputs
  if (!isFinite(length) || !isFinite(width) || !isFinite(height) || !isFinite(weight)) {
    return {
      cubicFeet: 0,
      density: 0,
      freightClass: 'Invalid Input',
      freightClassNum: 0,
      explanation: 'Please enter valid positive numbers for all dimensions and weight.'
    };
  }

  if (length <= 0 || width <= 0 || height <= 0 || weight <= 0) {
    return {
      cubicFeet: 0,
      density: 0,
      freightClass: 'Invalid Input',
      freightClassNum: 0,
      explanation: 'All dimensions and weight must be greater than zero.'
    };
  }

  // Convert to inches and pounds
  const lengthIn = unit === 'in' ? length : length * IN_PER_CM;
  const widthIn = unit === 'in' ? width : width * IN_PER_CM;
  const heightIn = unit === 'in' ? height : height * IN_PER_CM;
  const weightLb = weightUnit === 'lb' ? weight : weight * LB_PER_KG;

  // Calculate cubic feet
  const cubicInches = lengthIn * widthIn * heightIn;
  const cubicFeet = cubicInches / IN3_PER_FT3;

  // Calculate density (lb/ft³)
  const density = cubicFeet > 0 ? weightLb / cubicFeet : 0;

  // Estimate freight class based on density (NMFC guidelines)
  // Freight class is inversely related to density
  let freightClass = '';
  let freightClassNum = 0;
  let explanation = '';

  if (density >= 50) {
    freightClass = 'Class 50';
    freightClassNum = 50;
    explanation = 'Your shipment has excellent density (≥50 lb/ft³). This qualifies for Class 50, the lowest freight class with the most economical shipping rates. Dense, heavy freight like bricks or metal products typically fall into this category.';
  } else if (density >= 35) {
    freightClass = 'Class 55';
    freightClassNum = 55;
    explanation = 'With good density (35-50 lb/ft³), your shipment qualifies for Class 55. This class is ideal for dense items like machinery parts or hardwood flooring. Expect competitive shipping rates in this class.';
  } else if (density >= 30) {
    freightClass = 'Class 60';
    freightClassNum = 60;
    explanation = 'Your density (30-35 lb/ft³) places your shipment in Class 60. This class covers moderately dense freight like automotive parts or appliances. Shipping rates will be moderate.';
  } else if (density >= 22.5) {
    freightClass = 'Class 65';
    freightClassNum = 65;
    explanation = 'With density of 22.5-30 lb/ft³, your shipment is Class 65. This class is common for boxed or palletized goods with reasonable density, such as furniture components or packaged food products.';
  } else if (density >= 15) {
    freightClass = 'Class 70';
    freightClassNum = 70;
    explanation = 'Your density (15-22.5 lb/ft³) falls into Class 70. This class includes mixed loads, household goods, and general commodities. Expect moderate to higher shipping costs.';
  } else if (density >= 12) {
    freightClass = 'Class 77.5';
    freightClassNum = 77.5;
    explanation = 'With density of 12-15 lb/ft³, your shipment is Class 77.5. This class covers commodities like office supplies, electrical equipment, or packaged consumer goods.';
  } else if (density >= 10) {
    freightClass = 'Class 85';
    freightClassNum = 85;
    explanation = 'Your density (10-12 lb/ft³) places your shipment in Class 85. This class includes machinery, casters, or textile materials. Shipping costs will be higher due to lower density.';
  } else if (density >= 8) {
    freightClass = 'Class 92.5';
    freightClassNum = 92.5;
    explanation = 'With density of 8-10 lb/ft³, your shipment is Class 92.5. This class includes printed matter, plastic articles, or household appliances. Higher shipping costs apply.';
  } else if (density >= 6) {
    freightClass = 'Class 100';
    freightClassNum = 100;
    explanation = 'Your density (6-8 lb/ft³) falls into Class 100. This class covers auto parts, coolers, or TV sets. These lower-density items incur higher freight charges.';
  } else if (density >= 5) {
    freightClass = 'Class 110';
    freightClassNum = 110;
    explanation = 'With density of 5-6 lb/ft³, your shipment is Class 110. This class includes bagged goods, plastic containers, or wearing apparel. Expect higher shipping costs.';
  } else if (density >= 4) {
    freightClass = 'Class 125';
    freightClassNum = 125;
    explanation = 'Your density (4-5 lb/ft³) places your shipment in Class 125. This class covers items like small appliances, marked crates, or rubber articles.';
  } else if (density >= 3) {
    freightClass = 'Class 150';
    freightClassNum = 150;
    explanation = 'With density of 3-4 lb/ft³, your shipment is Class 150. This class includes boats, couches, or stuffed furniture. These low-density items have significant shipping costs.';
  } else if (density >= 2) {
    freightClass = 'Class 175';
    freightClassNum = 175;
    explanation = 'Your density (2-3 lb/ft³) falls into Class 175. This class covers lamps, tables, or pallets of mixed goods. Higher freight class means higher shipping costs.';
  } else if (density >= 1) {
    freightClass = 'Class 200';
    freightClassNum = 200;
    explanation = 'With density of 1-2 lb/ft³, your shipment is Class 200, the highest standard freight class. This includes lightweight but bulky items like pillows, foam, or plastic articles. Prepare for premium shipping rates.';
  } else {
    freightClass = 'Class 200+';
    freightClassNum = 200;
    explanation = 'Your shipment has very low density (<1 lb/ft³), placing it in Class 200+. These extremely lightweight or bulky items require special handling and will incur the highest freight charges. Consider optimizing packaging to reduce dimensional weight.';
  }

  return {
    cubicFeet: Math.round(cubicFeet * 100) / 100,
    density: Math.round(density * 100) / 100,
    freightClass,
    freightClassNum,
    explanation
  };
};

export interface ShippingCostResult {
  estimatedMin: number;
  estimatedMax: number;
  billableWeight: number;
  costFactors: string[];
  savingsTips: string[];
}

export type DistanceZone = 'local' | 'regional' | 'cross-country';
export type ServiceLevel = 'ground' | '2-day' | 'overnight';
export type PackageType = 'small' | 'large' | 'oversize';

export const calculateShippingCost = (
  weight: number,
  length: number,
  width: number,
  height: number,
  zone: DistanceZone,
  service: ServiceLevel,
  packageType: PackageType
): ShippingCostResult => {
  // Validate inputs
  if (!isFinite(weight) || !isFinite(length) || !isFinite(width) || !isFinite(height)) {
    return {
      estimatedMin: 0,
      estimatedMax: 0,
      billableWeight: 0,
      costFactors: ['Invalid input detected'],
      savingsTips: ['Please enter valid numbers for all fields']
    };
  }

  if (weight <= 0 || length <= 0 || width <= 0 || height <= 0) {
    return {
      estimatedMin: 0,
      estimatedMax: 0,
      billableWeight: 0,
      costFactors: ['All dimensions and weight must be positive'],
      savingsTips: ['Please enter valid positive numbers']
    };
  }

  // Calculate dimensional weight (using standard 139 divisor)
  const dimWeight = (length * width * height) / 139;

  // Determine billable weight
  const billableWeight = Math.max(weight, dimWeight);

  // Base rates per pound (varies by service level)
  const baseRates: Record<ServiceLevel, { min: number; max: number }> = {
    'ground': { min: 0.50, max: 1.20 },
    '2-day': { min: 1.50, max: 3.50 },
    'overnight': { min: 3.00, max: 8.00 }
  };

  // Zone multipliers
  const zoneMultipliers: Record<DistanceZone, number> = {
    'local': 1.0,
    'regional': 1.4,
    'cross-country': 1.8
  };

  // Package type surcharges
  const packageSurcharges: Record<PackageType, number> = {
    'small': 0,
    'large': 3.00,
    'oversize': 25.00
  };

  // Calculate base cost
  const baseRate = baseRates[service];
  const zoneMultiplier = zoneMultipliers[zone];
  const baseMin = billableWeight * baseRate.min * zoneMultiplier;
  const baseMax = billableWeight * baseRate.max * zoneMultiplier;

  // Add package surcharges
  const surcharge = packageSurcharges[packageType];
  const estimatedMin = baseMin + surcharge;
  const estimatedMax = baseMax + surcharge;

  // Build cost factors
  const costFactors: string[] = [
    `Billable weight: ${Math.round(billableWeight * 10) / 10} lbs (actual: ${weight} lbs, dimensional: ${Math.round(dimWeight * 10) / 10} lbs)`
  ];

  if (dimWeight > weight) {
    costFactors.push('Dimensional weight applies (package is large for its weight)');
  }

  costFactors.push(`Service level: ${service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ')}`);
  costFactors.push(`Distance zone: ${zone.charAt(0).toUpperCase() + zone.slice(1).replace('-', ' ')}`);

  if (packageType !== 'small') {
    costFactors.push(`Package type: ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} package surcharge applies`);
  }

  // Build savings tips
  const savingsTips: string[] = [];

  if (dimWeight > weight) {
    savingsTips.push('Reduce package size to lower dimensional weight');
    savingsTips.push('Consider using more compact packaging materials');
  }

  if (service === 'overnight' && weight > 5) {
    savingsTips.push('Consider 2-day shipping for significant savings');
  }

  if (packageType === 'oversize') {
    savingsTips.push('Split into multiple smaller packages if possible');
    savingsTips.push('Review carrier oversize threshold requirements');
  }

  if (zone === 'cross-country' && service === 'ground') {
    savingsTips.push('Ground shipping offers the best value for long distances');
  }

  savingsTips.push('Compare rates from multiple carriers');
  savingsTips.push('Negotiate volume discounts with carriers');

  return {
    estimatedMin: Math.round(estimatedMin * 100) / 100,
    estimatedMax: Math.round(estimatedMax * 100) / 100,
    billableWeight: Math.round(billableWeight * 100) / 100,
    costFactors,
    savingsTips
  };
};

export interface VolumeResult {
  cubicInches: number;
  cubicFeet: number;
  cubicCentimeters: number;
  cubicMeters: number;
  explanation: string;
}

export type VolumeUnit = 'inches' | 'centimeters' | 'meters';

export const calculateVolume = (
  length: number,
  width: number,
  height: number,
  unit: VolumeUnit
): VolumeResult => {
  // Validate inputs
  if (!isFinite(length) || !isFinite(width) || !isFinite(height)) {
    return {
      cubicInches: 0,
      cubicFeet: 0,
      cubicCentimeters: 0,
      cubicMeters: 0,
      explanation: 'Please enter valid numbers for all dimensions.'
    };
  }

  if (length <= 0 || width <= 0 || height <= 0) {
    return {
      cubicInches: 0,
      cubicFeet: 0,
      cubicCentimeters: 0,
      cubicMeters: 0,
      explanation: 'All dimensions must be greater than zero.'
    };
  }

  // Convert to all units
  let cubicInches: number;
  let cubicFeet: number;
  let cubicCentimeters: number;
  let cubicMeters: number;

  switch (unit) {
    case 'inches':
      cubicInches = length * width * height;
      cubicFeet = cubicInches / IN3_PER_FT3;
      cubicCentimeters = cubicInches / IN3_PER_CM3;
      cubicMeters = cubicCentimeters / CM3_PER_M3;
      break;
    case 'centimeters':
      cubicCentimeters = length * width * height;
      cubicInches = cubicCentimeters * IN3_PER_CM3;
      cubicFeet = cubicInches / IN3_PER_FT3;
      cubicMeters = cubicCentimeters / CM3_PER_M3;
      break;
    case 'meters':
      cubicMeters = length * width * height;
      cubicCentimeters = cubicMeters * CM3_PER_M3;
      cubicInches = cubicCentimeters * IN3_PER_CM3;
      cubicFeet = cubicInches / IN3_PER_FT3;
      break;
  }

  // Generate explanation
  let explanation = '';
  if (unit === 'inches') {
    explanation = `Your package measures ${length}" × ${width}" × ${height}" with a total volume of ${Math.round(cubicInches)} cubic inches (${Math.round(cubicFeet * 100) / 100} cubic feet). `;
  } else if (unit === 'centimeters') {
    explanation = `Your package measures ${length}cm × ${width}cm × ${height}cm with a total volume of ${Math.round(cubicCentimeters)} cubic centimeters. `;
  } else {
    explanation = `Your package measures ${length}m × ${width}m × ${height}m with a total volume of ${cubicMeters} cubic meters. `;
  }

  if (cubicFeet >= 1) {
    explanation += `This is equivalent to ${Math.round(cubicFeet * 100) / 100} cubic feet or approximately ${Math.round(cubicCentimeters)} cubic centimeters.`;
  } else {
    explanation += `This is useful for calculating shipping costs and comparing different package sizes.`;
  }

  return {
    cubicInches: Math.round(cubicInches * 100) / 100,
    cubicFeet: Math.round(cubicFeet * 1000) / 1000,
    cubicCentimeters: Math.round(cubicCentimeters * 100) / 100,
    cubicMeters: Math.round(cubicMeters * 10000) / 10000,
    explanation
  };
};

export interface ChargeableWeightResult {
  actualWeight: number;
  dimensionalWeight: number;
  chargeableWeight: number;
  whichApplies: 'actual' | 'dimensional';
  dimFactor: number;
  explanation: string;
}

export type ChargeableUnit = 'imperial' | 'metric';
export type DimFactor = 139 | 166 | 5000 | 'custom';

export const calculateChargeableWeight = (
  actualWeight: number,
  length: number,
  width: number,
  height: number,
  unit: ChargeableUnit,
  dimFactorValue: number
): ChargeableWeightResult => {
  // Validate inputs
  if (!isFinite(actualWeight) || !isFinite(length) || !isFinite(width) || !isFinite(height) || !isFinite(dimFactorValue)) {
    return {
      actualWeight: 0,
      dimensionalWeight: 0,
      chargeableWeight: 0,
      whichApplies: 'actual',
      dimFactor: dimFactorValue,
      explanation: 'Please enter valid numbers for all fields.'
    };
  }

  if (actualWeight <= 0 || length <= 0 || width <= 0 || height <= 0 || dimFactorValue <= 0) {
    return {
      actualWeight: 0,
      dimensionalWeight: 0,
      chargeableWeight: 0,
      whichApplies: 'actual',
      dimFactor: dimFactorValue,
      explanation: 'All values must be greater than zero.'
    };
  }

  // Convert dimensions to inches for calculation
  let lengthIn: number;
  let widthIn: number;
  let heightIn: number;
  let actualWeightLb: number;

  if (unit === 'imperial') {
    lengthIn = length;
    widthIn = width;
    heightIn = height;
    actualWeightLb = actualWeight;
  } else {
    // Metric: convert cm to inches, kg to lbs
    lengthIn = length * IN_PER_CM;
    widthIn = width * IN_PER_CM;
    heightIn = height * IN_PER_CM;
    actualWeightLb = actualWeight * LB_PER_KG;
  }

  // Calculate dimensional weight
  const dimensionalWeight = (lengthIn * widthIn * heightIn) / dimFactorValue;

  // Determine which weight applies
  const whichApplies: 'actual' | 'dimensional' = dimensionalWeight > actualWeightLb ? 'dimensional' : 'actual';
  const chargeableWeight = Math.max(actualWeightLb, dimensionalWeight);

  // Generate explanation
  let explanation = '';
  if (whichApplies === 'dimensional') {
    explanation = `The dimensional weight of ${Math.round(dimensionalWeight * 10) / 10} lbs exceeds the actual weight of ${Math.round(actualWeightLb * 10) / 10} lbs. `;
    explanation += `Carriers will charge based on dimensional weight (${Math.round(dimensionalWeight * 10) / 10} lbs) because your package takes up more space than its weight would suggest. `;
    explanation += `To reduce shipping costs, consider using smaller packaging to decrease the dimensional weight.`;
  } else {
    explanation = `The actual weight of ${Math.round(actualWeightLb * 10) / 10} lbs exceeds the dimensional weight of ${Math.round(dimensionalWeight * 10) / 10} lbs. `;
    explanation += `Your package is efficiently packed for its weight, so carriers will charge based on actual weight (${Math.round(actualWeightLb * 10) / 10} lbs). `;
    explanation += `This is ideal as you're not paying premium rates for lightweight, space-efficient shipments.`;
  }

  return {
    actualWeight: Math.round(actualWeightLb * 100) / 100,
    dimensionalWeight: Math.round(dimensionalWeight * 100) / 100,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    whichApplies,
    dimFactor: dimFactorValue,
    explanation
  };
};

export interface PalletResult {
  palletCount: number;
  boxesPerPallet: number;
  totalBoxes: number;
  totalWeight: number;
  palletUtilization: number;
  notes: string[];
}

export type PalletType = 'standard-us' | 'euro' | 'custom';

export interface PalletConfig {
  length: number;  // inches
  width: number;   // inches
  maxHeight: number;  // inches
  maxWeight: number;  // lbs
}

export const PALLET_CONFIGS: Record<PalletType, PalletConfig> = {
  'standard-us': { length: 48, width: 40, maxHeight: 96, maxWeight: 4500 },
  'euro': { length: 47.24, width: 31.5, maxHeight: 94, maxWeight: 2200 },
  'custom': { length: 48, width: 40, maxHeight: 96, maxWeight: 4500 }
};

export const calculatePallet = (
  boxLength: number,
  boxWidth: number,
  boxHeight: number,
  boxWeight: number,
  boxQuantity: number,
  palletType: PalletType,
  maxPalletHeight: number,
  maxPalletWeight: number
): PalletResult => {
  // Validate inputs
  if (!isFinite(boxLength) || !isFinite(boxWidth) || !isFinite(boxHeight) ||
      !isFinite(boxWeight) || !isFinite(boxQuantity) || !isFinite(maxPalletHeight) || !isFinite(maxPalletWeight)) {
    return {
      palletCount: 0,
      boxesPerPallet: 0,
      totalBoxes: 0,
      totalWeight: 0,
      palletUtilization: 0,
      notes: ['Invalid input detected. Please enter valid numbers for all fields.']
    };
  }

  if (boxLength <= 0 || boxWidth <= 0 || boxHeight <= 0 || boxWeight <= 0 || boxQuantity <= 0) {
    return {
      palletCount: 0,
      boxesPerPallet: 0,
      totalBoxes: 0,
      totalWeight: 0,
      palletUtilization: 0,
      notes: ['All box dimensions, weight, and quantity must be greater than zero.']
    };
  }

  const palletConfig = PALLET_CONFIGS[palletType];

  // Calculate how many boxes fit on each layer
  const boxesPerLayerX = Math.floor(palletConfig.length / boxLength);
  const boxesPerLayerY = Math.floor(palletConfig.width / boxWidth);
  const boxesPerLayer = boxesPerLayerX * boxesPerLayerY;

  if (boxesPerLayer === 0) {
    return {
      palletCount: boxQuantity,
      boxesPerPallet: 1,
      totalBoxes: boxQuantity,
      totalWeight: boxQuantity * boxWeight,
      palletUtilization: 0,
      notes: ['Box dimensions exceed pallet size. Each box will require its own pallet or special handling.']
    };
  }

  // Calculate how many layers fit based on height
  const maxHeight = maxPalletHeight > 0 ? maxPalletHeight : palletConfig.maxHeight;
  const boxesPerPalletByHeight = Math.floor(maxHeight / boxHeight);
  const boxesPerPalletByWeight = Math.floor(maxPalletWeight / boxWeight);

  // Total boxes per pallet is limited by both dimensions and weight
  const boxesPerPalletBySpace = boxesPerLayer * boxesPerPalletByHeight;
  const boxesPerPallet = Math.min(boxesPerPalletBySpace, boxesPerPalletByWeight);

  if (boxesPerPallet === 0) {
    return {
      palletCount: boxQuantity,
      boxesPerPallet: 1,
      totalBoxes: boxQuantity,
      totalWeight: boxQuantity * boxWeight,
      palletUtilization: 0,
      notes: ['Box dimensions or weight exceed pallet limits. Reduce box size or weight.']
    };
  }

  // Calculate total pallets needed
  const palletCount = Math.ceil(boxQuantity / boxesPerPallet);

  // Calculate pallet utilization
  const usedLayerArea = boxesPerLayer * boxLength * boxWidth;
  const palletArea = palletConfig.length * palletConfig.width;
  const palletUtilization = (usedLayerArea / palletArea) * 100;

  // Generate notes
  const notes: string[] = [];

  if (palletUtilization < 50) {
    notes.push(`Pallet utilization is ${Math.round(palletUtilization)}%. Consider using smaller boxes or a different box arrangement to maximize space.`);
  } else if (palletUtilization >= 80) {
    notes.push(`Excellent pallet utilization at ${Math.round(palletUtilization)}%. Your boxes are well-sized for this pallet.`);
  }

  if (boxesPerPalletByWeight < boxesPerPalletBySpace) {
    notes.push(`Weight limit is the constraining factor. Each pallet can hold ${boxesPerPalletByWeight} boxes by weight vs ${boxesPerPalletBySpace} by space.`);
  }

  if (palletType === 'euro') {
    notes.push('Euro pallets (EUR-pallet) follow EUR-pallet specifications with dimensions of 1200x800mm.');
  } else if (palletType === 'standard-us') {
    notes.push('Standard US pallets (GMA pallets) are 48x40 inches and the most common in North America.');
  }

  // Calculate total weight
  const totalWeight = boxQuantity * boxWeight;

  return {
    palletCount,
    boxesPerPallet,
    totalBoxes: boxQuantity,
    totalWeight: Math.round(totalWeight * 100) / 100,
    palletUtilization: Math.round(palletUtilization * 10) / 10,
    notes
  };
};
