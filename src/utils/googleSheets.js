import Papa from 'papaparse'

// Attend une URL de publication Google Sheets au format CSV
// (Fichier → Partager → Publier sur le web → Format CSV)
export async function fetchSheetData(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} — vérifiez que la feuille est bien publiée en accès public`)

  const text = await res.text()

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        try {
          const rows = data.map(row => ({
            zone:      row.zone?.trim(),
            zoneName:  row.zone_nom?.trim(),
            style:     row.style?.trim(),
            prix_base: parseFloat(row.prix_base),
            occupancy: [
              parseFloat(row.occ_jan), parseFloat(row.occ_fev), parseFloat(row.occ_mar),
              parseFloat(row.occ_avr), parseFloat(row.occ_mai), parseFloat(row.occ_jun),
              parseFloat(row.occ_jul), parseFloat(row.occ_aou), parseFloat(row.occ_sep),
              parseFloat(row.occ_oct), parseFloat(row.occ_nov), parseFloat(row.occ_dec),
            ],
            price_coeffs: [
              parseFloat(row.coeff_jan), parseFloat(row.coeff_fev), parseFloat(row.coeff_mar),
              parseFloat(row.coeff_avr), parseFloat(row.coeff_mai), parseFloat(row.coeff_jun),
              parseFloat(row.coeff_jul), parseFloat(row.coeff_aou), parseFloat(row.coeff_sep),
              parseFloat(row.coeff_oct), parseFloat(row.coeff_nov), parseFloat(row.coeff_dec),
            ],
          })).filter(r => r.zone && r.style && !isNaN(r.prix_base))

          if (rows.length === 0)
            throw new Error('Aucune ligne valide trouvée — vérifiez les noms de colonnes')

          resolve(rows)
        } catch (e) {
          reject(e)
        }
      },
      error: reject,
    })
  })
}

// Colonnes attendues dans la Google Sheet (pour info / template)
export const SHEET_COLUMNS = [
  'zone','zone_nom','style','prix_base',
  'occ_jan','occ_fev','occ_mar','occ_avr','occ_mai','occ_jun',
  'occ_jul','occ_aou','occ_sep','occ_oct','occ_nov','occ_dec',
  'coeff_jan','coeff_fev','coeff_mar','coeff_avr','coeff_mai','coeff_jun',
  'coeff_jul','coeff_aou','coeff_sep','coeff_oct','coeff_nov','coeff_dec',
]
