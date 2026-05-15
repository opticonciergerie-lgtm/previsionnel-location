// Données de référence – Vendée littoral
// occupancy = taux de remplissage mensuel en % (Jan → Déc)
// price_coeffs = coefficient multiplicateur du prix de base (Jan → Déc)
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

  // ── CHÂTEAU D'OLONNE ──
  {
    zone: 'chateau-olonne',
    zoneName: "Château d'Olonne",
    style: 'classique',
    prix_base: 80,
    occupancy:    [20, 25, 32, 50, 60, 75, 87, 90, 68, 40, 20, 25],
    price_coeffs: [0.53, 0.58, 0.63, 0.80, 0.88, 1.08, 1.50, 1.58, 1.02, 0.72, 0.53, 0.63],
  },
  {
    zone: 'chateau-olonne',
    zoneName: "Château d'Olonne",
    style: 'luxe',
    prix_base: 165,
    occupancy:    [18, 22, 28, 46, 56, 72, 84, 87, 64, 36, 18, 22],
    price_coeffs: [0.53, 0.58, 0.63, 0.80, 0.88, 1.08, 1.48, 1.55, 1.00, 0.72, 0.53, 0.63],
  },
  {
    zone: 'chateau-olonne',
    zoneName: "Château d'Olonne",
    style: 'atypique',
    prix_base: 100,
    occupancy:    [25, 30, 38, 56, 65, 78, 88, 91, 70, 46, 25, 32],
    price_coeffs: [0.55, 0.60, 0.65, 0.82, 0.90, 1.08, 1.48, 1.55, 1.02, 0.74, 0.55, 0.65],
  },

  // ── OLONNE SUR MER ──
  {
    zone: 'olonne-sur-mer',
    zoneName: 'Olonne sur Mer',
    style: 'classique',
    prix_base: 78,
    occupancy:    [18, 23, 30, 48, 58, 73, 85, 88, 65, 38, 18, 23],
    price_coeffs: [0.52, 0.57, 0.62, 0.78, 0.87, 1.06, 1.48, 1.55, 1.00, 0.70, 0.52, 0.62],
  },
  {
    zone: 'olonne-sur-mer',
    zoneName: 'Olonne sur Mer',
    style: 'luxe',
    prix_base: 155,
    occupancy:    [15, 20, 26, 44, 54, 70, 82, 85, 62, 34, 15, 20],
    price_coeffs: [0.52, 0.57, 0.62, 0.78, 0.87, 1.06, 1.45, 1.52, 0.98, 0.70, 0.52, 0.62],
  },
  {
    zone: 'olonne-sur-mer',
    zoneName: 'Olonne sur Mer',
    style: 'atypique',
    prix_base: 98,
    occupancy:    [22, 28, 35, 54, 63, 75, 86, 89, 67, 44, 23, 30],
    price_coeffs: [0.54, 0.59, 0.64, 0.80, 0.88, 1.06, 1.46, 1.53, 1.00, 0.72, 0.54, 0.64],
  },

  // ── LA TRANCHE SUR MER ──
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'classique',
    prix_base: 110,
    occupancy:    [12, 15, 22, 45, 58, 78, 94, 97, 68, 35, 12, 15],
    price_coeffs: [0.50, 0.55, 0.62, 0.80, 0.90, 1.15, 1.62, 1.72, 1.05, 0.72, 0.50, 0.60],
  },
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'luxe',
    prix_base: 210,
    occupancy:    [10, 13, 18, 40, 54, 74, 90, 94, 64, 30, 10, 13],
    price_coeffs: [0.50, 0.55, 0.62, 0.80, 0.90, 1.12, 1.58, 1.68, 1.03, 0.72, 0.50, 0.60],
  },
  {
    zone: 'tranche-sur-mer',
    zoneName: 'La Tranche sur Mer',
    style: 'atypique',
    prix_base: 135,
    occupancy:    [15, 18, 26, 50, 62, 80, 93, 96, 70, 38, 15, 18],
    price_coeffs: [0.52, 0.57, 0.64, 0.82, 0.92, 1.13, 1.60, 1.68, 1.05, 0.74, 0.52, 0.62],
  },

  // ── LONGEVILLE SUR MER ──
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'classique',
    prix_base: 95,
    occupancy:    [10, 14, 20, 42, 55, 75, 92, 95, 65, 32, 10, 14],
    price_coeffs: [0.50, 0.54, 0.60, 0.78, 0.88, 1.12, 1.58, 1.65, 1.03, 0.70, 0.50, 0.58],
  },
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'luxe',
    prix_base: 185,
    occupancy:    [8, 12, 17, 38, 51, 71, 88, 92, 61, 28, 8, 12],
    price_coeffs: [0.50, 0.54, 0.60, 0.78, 0.88, 1.10, 1.55, 1.62, 1.00, 0.70, 0.50, 0.58],
  },
  {
    zone: 'longeville-sur-mer',
    zoneName: 'Longeville sur Mer',
    style: 'atypique',
    prix_base: 118,
    occupancy:    [13, 17, 24, 47, 59, 77, 91, 94, 67, 36, 13, 17],
    price_coeffs: [0.52, 0.56, 0.62, 0.80, 0.90, 1.10, 1.56, 1.63, 1.02, 0.72, 0.52, 0.60],
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
