// Profils tarifaires nationaux — base classique T2 4 personnes
// Les styles luxe/atypique sont calculés par multiplicateur dans calculations.js

export const FRANCE_PROFILES = {
  coastal_premium: {
    zoneName: "Côte d'Azur / Corse / Var",
    prix_base: 115,
    occupancy:    [35, 40, 48, 58, 65, 72, 88, 92, 74, 58, 40, 45],
    price_coeffs: [0.72, 0.75, 0.82, 0.92, 1.00, 1.15, 1.48, 1.62, 1.15, 0.90, 0.75, 0.80],
  },
  coastal_high: {
    zoneName: 'Littoral Languedoc / Atlantique Sud',
    prix_base: 88,
    occupancy:    [18, 22, 30, 45, 58, 68, 88, 92, 70, 44, 20, 20],
    price_coeffs: [0.60, 0.62, 0.72, 0.84, 0.92, 1.08, 1.42, 1.58, 1.08, 0.80, 0.62, 0.68],
  },
  coastal_med: {
    zoneName: 'Bretagne / Normandie / Atlantique',
    prix_base: 70,
    occupancy:    [15, 18, 25, 42, 55, 65, 82, 90, 67, 38, 16, 16],
    price_coeffs: [0.58, 0.62, 0.68, 0.82, 0.90, 1.06, 1.40, 1.55, 1.05, 0.76, 0.58, 0.65],
  },
  urban_premium: {
    zoneName: 'Paris & Petite Couronne',
    prix_base: 130,
    occupancy:    [68, 70, 75, 80, 82, 80, 76, 80, 80, 78, 70, 74],
    price_coeffs: [0.88, 0.90, 1.00, 1.10, 1.15, 1.12, 1.05, 1.08, 1.12, 1.05, 0.90, 0.98],
  },
  urban_high: {
    zoneName: 'Grande Ville (Lyon, Bordeaux, Toulouse…)',
    prix_base: 82,
    occupancy:    [55, 58, 64, 70, 72, 70, 66, 70, 72, 67, 58, 60],
    price_coeffs: [0.82, 0.84, 0.90, 1.00, 1.05, 1.05, 0.98, 1.02, 1.05, 0.98, 0.85, 0.90],
  },
  mountain_premium: {
    zoneName: 'Alpes (Haute-Savoie, Savoie)',
    prix_base: 108,
    occupancy:    [75, 80, 38, 28, 22, 28, 74, 80, 35, 25, 22, 70],
    price_coeffs: [1.42, 1.58, 0.85, 0.68, 0.65, 0.72, 1.22, 1.32, 0.80, 0.65, 0.65, 1.38],
  },
  mountain_med: {
    zoneName: 'Pyrénées / Isère / Massif Central',
    prix_base: 76,
    occupancy:    [55, 62, 30, 24, 22, 28, 65, 70, 30, 22, 20, 48],
    price_coeffs: [1.22, 1.35, 0.80, 0.68, 0.65, 0.72, 1.12, 1.22, 0.78, 0.65, 0.65, 1.18],
  },
  tourist: {
    zoneName: 'Destination Touristique (Alsace, Loire, Périgord…)',
    prix_base: 78,
    occupancy:    [28, 32, 48, 62, 68, 68, 72, 76, 68, 58, 32, 38],
    price_coeffs: [0.72, 0.78, 0.88, 1.00, 1.05, 1.05, 1.12, 1.15, 1.05, 0.95, 0.78, 0.88],
  },
  default: {
    zoneName: 'France — estimation générale',
    prix_base: 52,
    occupancy:    [14, 16, 22, 35, 48, 58, 72, 76, 55, 32, 16, 16],
    price_coeffs: [0.65, 0.68, 0.75, 0.85, 0.92, 1.00, 1.25, 1.35, 1.00, 0.80, 0.68, 0.72],
  },
}

// Multiplicateurs style (appliqués sur la base classique)
export const STYLE_MULTIPLIERS = {
  classique: { price: 1.00, occ:  0 },
  luxe:      { price: 1.60, occ: -4 },
  atypique:  { price: 1.35, occ: +3 },
}

// Département → profil
export const DEPT_TO_PROFILE = {
  // Côte d'Azur / Corse
  '06': 'coastal_premium', '83': 'coastal_premium',
  '2A': 'coastal_premium', '2B': 'coastal_premium',
  '971': 'coastal_premium', '972': 'coastal_premium',
  // Littoral Languedoc / Atlantique sud
  '11': 'coastal_high', '17': 'coastal_high', '30': 'coastal_high',
  '34': 'coastal_high', '40': 'coastal_high', '64': 'coastal_high',
  '66': 'coastal_high', '974': 'coastal_high',
  // Bretagne / Normandie / Atlantique
  '14': 'coastal_med', '22': 'coastal_med', '29': 'coastal_med',
  '44': 'coastal_med', '50': 'coastal_med', '56': 'coastal_med',
  '62': 'coastal_med', '76': 'coastal_med', '80': 'coastal_med',
  '85': 'coastal_med',
  // Paris
  '75': 'urban_premium', '92': 'urban_premium',
  // Grandes villes
  '13': 'urban_high', '31': 'urban_high', '33': 'urban_high',
  '35': 'urban_high', '59': 'urban_high', '69': 'urban_high',
  // Alpes premium
  '73': 'mountain_premium', '74': 'mountain_premium',
  // Montagne intermédiaire
  '04': 'mountain_med', '05': 'mountain_med', '09': 'mountain_med',
  '38': 'mountain_med', '65': 'mountain_med', '88': 'mountain_med',
  // Destinations touristiques
  '07': 'tourist', '12': 'tourist', '21': 'tourist', '24': 'tourist',
  '26': 'tourist', '37': 'tourist', '41': 'tourist', '46': 'tourist',
  '63': 'tourist', '67': 'tourist', '68': 'tourist', '84': 'tourist',
}
