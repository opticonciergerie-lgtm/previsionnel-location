// Données de référence pour Les Sables d'Olonne
// occupancy = taux de remplissage mensuel en % (Jan → Déc)
// price_coeffs = coefficient multiplicateur du prix de base (Jan → Déc)

export const defaultData = [
  // ── BORD DE MER ──
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'classique',
    prix_base: 130,
    occupancy:    [20, 25, 32, 52, 62, 80, 93, 96, 73, 42, 20, 25],
    price_coeffs: [0.55, 0.60, 0.65, 0.82, 0.90, 1.12, 1.58, 1.68, 1.06, 0.75, 0.55, 0.65],
  },
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'luxe',
    prix_base: 260,
    occupancy:    [18, 22, 28, 48, 58, 76, 90, 93, 70, 38, 18, 22],
    price_coeffs: [0.55, 0.60, 0.65, 0.82, 0.90, 1.12, 1.55, 1.65, 1.05, 0.75, 0.55, 0.65],
  },
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'atypique',
    prix_base: 165,
    occupancy:    [25, 30, 38, 58, 68, 82, 93, 95, 75, 50, 28, 35],
    price_coeffs: [0.58, 0.62, 0.68, 0.84, 0.92, 1.10, 1.52, 1.60, 1.05, 0.78, 0.58, 0.68],
  },

  // ── CENTRE-VILLE ──
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'classique',
    prix_base: 90,
    occupancy:    [22, 28, 35, 55, 65, 78, 90, 93, 72, 45, 22, 28],
    price_coeffs: [0.55, 0.60, 0.65, 0.80, 0.88, 1.08, 1.50, 1.58, 1.03, 0.73, 0.55, 0.65],
  },
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'luxe',
    prix_base: 185,
    occupancy:    [20, 25, 30, 50, 60, 75, 87, 90, 68, 40, 20, 25],
    price_coeffs: [0.55, 0.60, 0.65, 0.80, 0.88, 1.08, 1.48, 1.55, 1.02, 0.73, 0.55, 0.65],
  },
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'atypique',
    prix_base: 115,
    occupancy:    [28, 33, 40, 60, 68, 80, 91, 93, 72, 48, 28, 35],
    price_coeffs: [0.58, 0.62, 0.68, 0.82, 0.90, 1.08, 1.48, 1.55, 1.03, 0.76, 0.58, 0.68],
  },

  // ── PÉRIPHÉRIE / CAMPAGNE ──
  {
    zone: 'peripherie',
    zoneName: "Les Sables d'Olonne – Périphérie / Campagne",
    style: 'classique',
    prix_base: 75,
    occupancy:    [18, 22, 28, 48, 58, 72, 85, 90, 65, 38, 18, 22],
    price_coeffs: [0.52, 0.58, 0.62, 0.78, 0.85, 1.05, 1.45, 1.55, 1.00, 0.70, 0.52, 0.62],
  },
  {
    zone: 'peripherie',
    zoneName: "Les Sables d'Olonne – Périphérie / Campagne",
    style: 'luxe',
    prix_base: 155,
    occupancy:    [15, 20, 25, 45, 55, 70, 82, 87, 62, 35, 15, 20],
    price_coeffs: [0.52, 0.58, 0.62, 0.78, 0.85, 1.05, 1.45, 1.52, 0.98, 0.70, 0.52, 0.62],
  },
  {
    zone: 'peripherie',
    zoneName: "Les Sables d'Olonne – Périphérie / Campagne",
    style: 'atypique',
    prix_base: 95,
    occupancy:    [22, 28, 35, 55, 65, 75, 87, 92, 68, 45, 25, 32],
    price_coeffs: [0.55, 0.60, 0.65, 0.80, 0.88, 1.05, 1.45, 1.52, 1.00, 0.73, 0.55, 0.65],
  },
]
