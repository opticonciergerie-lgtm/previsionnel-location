export const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// Prix relatif selon la capacité (base = 4 personnes)
function getCapacityMult(capacite) {
  if (capacite <= 2) return 0.70
  if (capacite <= 4) return 1.00
  if (capacite <= 6) return 1.35
  if (capacite <= 8) return 1.65
  if (capacite <= 10) return 1.95
  return 2.30
}

// Impact des prestations sur le prix et le taux de remplissage
const EXTRAS_PRICE = {
  piscine: 0.15,
  vue_mer: 0.20,
  jardin:  0.07,
  parking: 0.05,
  jacuzzi: 0.12,
}

const EXTRAS_OCC = {
  piscine: 0.05,
  vue_mer: 0.08,
  jardin:  0.03,
  parking: 0.02,
  jacuzzi: 0.04,
}

export function computeForecast(property, referenceData) {
  const { zone, style, capacite, extras = [] } = property

  const ref = referenceData.find(r => r.zone === zone && r.style === style)
  if (!ref) return null

  const capMult        = getCapacityMult(capacite)
  const extrasPriceMult = extras.reduce((acc, e) => acc + (EXTRAS_PRICE[e] ?? 0), 0)
  const extrasOccBonus  = extras.reduce((acc, e) => acc + (EXTRAS_OCC[e]   ?? 0), 0)

  return MONTHS.map((month, i) => {
    const nightlyPrice  = Math.round(ref.prix_base * capMult * (1 + extrasPriceMult) * ref.price_coeffs[i])
    const occupancyRate = Math.min(97, Math.round(ref.occupancy[i] * (1 + extrasOccBonus)))
    const daysInMonth   = DAYS_IN_MONTH[i]
    const nightsBooked  = Math.round((occupancyRate / 100) * daysInMonth)
    const revenue       = nightlyPrice * nightsBooked

    return { month, occupancyRate, nightly_price: nightlyPrice, daysInMonth, nightsBooked, revenue }
  })
}
