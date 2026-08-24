import { DEPT_TO_PROFILE, FRANCE_PROFILES } from '../data/franceProfiles.js'

// Correspondance codes postaux → zones existantes (données précises Vendée)
const POSTCODE_TO_ZONE = {
  '85800': 'saint-gilles',
  '85100': 'bord-mer',
  '85360': 'tranche-sur-mer',
  '85560': 'longeville-sur-mer',
}

function getDept(postcode) {
  if (!postcode) return null
  const p = postcode.toString().padStart(5, '0')
  if (p.startsWith('97')) return p.substring(0, 3)
  if (p.startsWith('20')) return parseInt(p.substring(2, 5)) <= 169 ? '2A' : '2B'
  return p.substring(0, 2)
}

// Retourne { zone, zoneName, isKnown }
// zone = slug utilisé dans referenceData ou 'fr_<profileId>'
export function detectZone(postcode, referenceData) {
  const knownZone = POSTCODE_TO_ZONE[postcode]
  if (knownZone && referenceData.some(r => r.zone === knownZone)) {
    const entry = referenceData.find(r => r.zone === knownZone)
    return { zone: knownZone, zoneName: entry?.zoneName ?? knownZone, isKnown: true }
  }

  const dept = getDept(postcode)
  const profileId = DEPT_TO_PROFILE[dept] || 'default'
  const profile = FRANCE_PROFILES[profileId]
  return {
    zone: `fr_${profileId}`,
    zoneName: profile?.zoneName ?? 'France — estimation générale',
    isKnown: false,
  }
}
