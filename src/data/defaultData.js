// Données de référence – Vendée littoral
// occupancy = taux de remplissage mensuel en % (Jan → Déc)
// price_coeffs = coefficient multiplicateur du prix de base (Jan → Déc)

export const defaultData = [
  // ── BORD DE MER ──
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'classique',
    prix_base: 80,
    occupancy:    [20, 25, 32, 52, 62, 80, 93, 96, 73, 42, 20, 25],
    price_coeffs: [0.55, 0.60, 0.65, 0.82, 0.90, 1.12, 1.58, 1.68, 1.06, 0.75, 0.55, 0.65],
  },
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'luxe',
    prix_base: 133,
    occupancy:    [18, 22, 28, 48, 58, 76, 90, 93, 70, 38, 18, 22],
    price_coeffs: [0.55, 0.60, 0.65, 0.82, 0.90, 1.12, 1.55, 1.65, 1.05, 0.75, 0.55, 0.65],
  },
  {
    zone: 'bord-mer',
    zoneName: "Les Sables d'Olonne – Bord de mer",
    style: 'atypique',
    prix_base: 119,
    occupancy:    [25, 30, 38, 58, 68, 82, 93, 95, 75, 50, 28, 35],
    price_coeffs: [0.58, 0.62, 0.68, 0.84, 0.92, 1.10, 1.52, 1.60, 1.05, 0.78, 0.58, 0.68],
  },

  // ── CENTRE-VILLE ──
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'classique',
    prix_base: 55,
    occupancy:    [22, 28, 35, 55, 65, 78, 90, 93, 72, 45, 22, 28],
    price_coeffs: [0.55, 0.60, 0.65, 0.80, 0.88, 1.08, 1.50, 1.58, 1.03, 0.73, 0.55, 0.65],
  },
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'luxe',
    prix_base: 94,
    occupancy:    [20, 25, 30, 50, 60, 75, 87, 90, 68, 40, 20, 25],
    price_coeffs: [0.55, 0.60, 0.65, 0.80, 0.88, 1.08, 1.48, 1.55, 1.02, 0.73, 0.55, 0.65],
  },
  {
    zone: 'centre',
    zoneName: "Les Sables d'Olonne – Centre-ville",
    style: 'atypique',
    prix_base: 83,
    occupancy:    [28, 33, 40, 60, 68, 80, 91, 93, 72, 48, 28, 35],
    price_coeffs: [0.58, 0.62, 0.68, 0.82, 0.90, 1.08, 1.48, 1.55, 1.03, 0.76, 0.58, 0.68],
  },

  // ── LA TRANCHE SUR MER ──
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'classique',
    prix_base: 68,
    occupancy:    [12, 15, 22, 45, 58, 78, 94, 97, 68, 35, 12, 15],
    price_coeffs: [0.50, 0.55, 0.62, 0.80, 0.90, 1.15, 1.62, 1.72, 1.05, 0.72, 0.50, 0.60],
  },
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'luxe',
    prix_base: 114,
    occupancy:    [10, 13, 18, 40, 54, 74, 90, 94, 64, 30, 10, 13],
    price_coeffs: [0.50, 0.55, 0.62, 0.80, 0.90, 1.12, 1.58, 1.68, 1.03, 0.72, 0.50, 0.60],
  },
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'atypique',
    prix_base: 98,
    occupancy:    [15, 18, 26, 50, 62, 80, 93, 96, 70, 38, 15, 18],
    price_coeffs: [0.52, 0.57, 0.64, 0.82, 0.92, 1.13, 1.60, 1.68, 1.05, 0.74, 0.52, 0.62],
  },

  // ── LONGEVILLE SUR MER ──
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'classique',
    prix_base: 59,
    occupancy:    [10, 14, 20, 42, 55, 75, 92, 95, 65, 32, 10, 14],
    price_coeffs: [0.50, 0.54, 0.60, 0.78, 0.88, 1.12, 1.58, 1.65, 1.03, 0.70, 0.50, 0.58],
  },
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'luxe',
    prix_base: 98,
    occupancy:    [8, 12, 17, 38, 51, 71, 88, 92, 61, 28, 8, 12],
    price_coeffs: [0.50, 0.54, 0.60, 0.78, 0.88, 1.10, 1.55, 1.62, 1.00, 0.70, 0.50, 0.58],
  },
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'atypique',
    prix_base: 85,
    occupancy:    [13, 17, 24, 47, 59, 77, 91, 94, 67, 36, 13, 17],
    price_coeffs: [0.52, 0.56, 0.62, 0.80, 0.90, 1.10, 1.56, 1.63, 1.02, 0.72, 0.52, 0.60],
  },

]
