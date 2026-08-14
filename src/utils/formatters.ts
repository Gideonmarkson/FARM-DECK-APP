import { LagosLGA } from '../types';

export const LAGOS_LGAS: LagosLGA[] = [
  'Kosofe',
  'Yaba / Mainland',
  'Eti-Osa (Lekki / Ikoyi)',
  'Ikeja',
  'Ikorodu',
  'Epe',
  'Badagry',
  'Agege',
  'Alimosho',
  'Mushin',
  'Surulere',
  'Oshodi-Isolo',
  'Amuwo-Odofin (Festac)',
  'Apapa',
  'Lagos Island',
  'Ojo',
  'Ifako-Ijaiye',
  'Shomolu (Bariga)',
  'Ajeromi-Ifelodun',
  'Ibeju-Lekki'
];

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Dynamic delivery fee calculator across Lagos LGAs
 * Hyperlocal (< 3km): ₦350 - ₦500
 * Same LGA: ₦600 - ₦800
 * Neighboring LGA: ₦1,000 - ₦1,400
 * Far LGA (e.g., Badagry to Lekki / Epe): ₦1,800 - ₦2,500
 */
export function calculateDeliveryFee(pickupLGA: LagosLGA, deliveryLGA: LagosLGA, isNearMe: boolean): number {
  if (isNearMe) {
    return 400; // Hyperlocal flat rate
  }
  if (pickupLGA === deliveryLGA) {
    return 700;
  }
  
  const longDistanceLGAs: LagosLGA[] = ['Badagry', 'Epe', 'Ikorodu'];
  if (longDistanceLGAs.includes(pickupLGA) || longDistanceLGAs.includes(deliveryLGA)) {
    return 1800;
  }
  
  return 1200;
}

export function formatFreshnessBadge(freshness: string): { label: string; style: string } {
  switch (freshness) {
    case 'GRADE_A_TODAY':
      return { label: '🌟 Harvested Today (Grade A+)', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    case 'GRADE_A_ARRIVED':
      return { label: '✨ Fresh Arrival (Grade A)', style: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
    case 'GRADE_B':
      return { label: '⚡ Standard Fresh (Grade B)', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    default:
      return { label: 'Fresh Produce', style: 'bg-slate-700 text-slate-300' };
  }
}
