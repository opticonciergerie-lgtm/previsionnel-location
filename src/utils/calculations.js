import { FRANCE_PROFILES, STYLE_MULTIPLIERS } from '../data/franceProfiles.js'

export const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function getCapacityMult(capacite) {
  if (capacite <= 2) return 0.70
  if (capacite <= 4) return 1.00
  if (capacite <= 6) return 1.35
  if (capacite <= 8) return 1.65
  if (capacite <= 10) return 1.95
  return 2.30
}

const EXTRAS_PRICE = {
  piscine: 0.15, vue_mer: 0.08, jardin: 0.05, parking: 0.04, jacuzzi: 0.12,
}
const EXTRAS_OCC = {
  piscine: 0.05, vue_mer: 0.08, jardin: 0.03, parking: 0.02, jacuzzi: 0.04,
}

function resolveRef(zone, style, referenceData) {
  // 1. Données précises existantes (Vendée etc.)
  const exact = referenceData.find(r => r.zone === zone && r.style === style)
  if (exact) return exact

  // 2. Profil France national (zone = 'fr_<profileId>')
  if (zone.startsWith('fr_')) {
    const profileId = zone.slice(3)
    const profile = FRANCE_PROFILES[profileId]
    if (!profile) return null
    const m = STYLE_MULTIPLIERS[style] ?? STYLE_MULTIPLIERS.classique
    return {
      zone, style,
      zoneName: profile.zoneName,
      prix_base: Math.round(profile.prix_base * m.price),
      occupancy: profile.occupancy.map(o => Math.min(97, Math.max(5, o + m.occ))),
      price_coeffs: profile.price_coeffs,
    }
  }
  return null
}

export function computeForecast(property, referenceData) {
  const { zone, style, capacite, extras = [] } = property

  const ref = resolveRef(zone, style, referenceData)
  if (!ref) return null

  const capMult        = getCapacityMult(capacite)
  const extrasPriceMult = extras.reduce((acc, e) => acc + (EXTRAS_PRICE[e] ?? 0), 0)
  const extrasOccBonus  = extras.reduce((acc, e) => acc + (EXTRAS_OCC[e]   ?? 0), 0)

  return MONTHS.map((month, i) => {
    const nightlyPrice  = Math.max(40, Math.round(ref.prix_base * capMult * (1 + extrasPriceMult) * ref.price_coeffs[i]))
    const occupancyRate = Math.min(97, Math.round(ref.occupancy[i] + extrasOccBonus * 100))
    const daysInMonth   = DAYS_IN_MONTH[i]
    const nightsBooked  = Math.round((occupancyRate / 100) * daysInMonth)
    const revenue       = nightlyPrice * nightsBooked

    return { month, occupancyRate, nightly_price: nightlyPrice, daysInMonth, nightsBooked, revenue }
  })
}
