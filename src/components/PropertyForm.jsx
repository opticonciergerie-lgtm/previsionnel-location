import { useState, useRef, useCallback, useEffect } from 'react'
import { detectZone } from '../utils/geoDetection.js'

const STYLES = [
  { value: 'classique', label: 'Classique' },
  { value: 'luxe',      label: 'Luxe / Premium' },
  { value: 'atypique',  label: 'Atypique / Original' },
]

const EXTRAS = [
  { value: 'piscine', label: '🏊 Piscine' },
  { value: 'vue_mer', label: '🌊 Vue mer' },
  { value: 'jardin',  label: '🌿 Jardin' },
  { value: 'parking', label: '🚗 Parking privatif' },
  { value: 'jacuzzi', label: '🛁 Jacuzzi / Spa' },
]

export default function PropertyForm({ property, onChange, referenceData, unlocked, onUnlock, sending, leadError }) {
  const [query, setQuery]           = useState(property.adresse || '')
  const [suggestions, setSuggestions] = useState([])
  const [addrLoading, setAddrLoading] = useState(false)
  const [detectedZoneName, setDetectedZoneName] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef  = useRef(null)

  const set = (key, value) => onChange({ ...property, [key]: value })

  const toggleExtra = extra => {
    const next = property.extras.includes(extra)
      ? property.extras.filter(e => e !== extra)
      : [...property.extras, extra]
    set('extras', next)
  }

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const searchAddress = useCallback((q) => {
    clearTimeout(debounceRef.current)
    if (q.length < 3) { setSuggestions([]); setShowDropdown(false); return }
    setAddrLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=6&autocomplete=1`)
        const data = await res.json()
        setSuggestions(data.features || [])
        setShowDropdown((data.features || []).length > 0)
      } catch { setSuggestions([]); setShowDropdown(false) }
      finally  { setAddrLoading(false) }
    }, 280)
  }, [])

  const handleInputChange = e => {
    const v = e.target.value
    setQuery(v)
    onChange({ ...property, adresse: v, zone: property.zone })
    searchAddress(v)
  }

  const handleSelect = feature => {
    const { label, postcode, city } = feature.properties
    const { zone, zoneName } = detectZone(postcode, referenceData)
    setQuery(label)
    setSuggestions([])
    setShowDropdown(false)
    setDetectedZoneName(zoneName)
    onChange({ ...property, adresse: label, zone })
  }

  return (
    <div className="property-form">
      <h2>Informations du bien</h2>

      <div className="form-group">
        <label>Nom du propriétaire <span className="label-required">*</span></label>
        <input
          type="text"
          value={property.proprietaire}
          onChange={e => set('proprietaire', e.target.value)}
          placeholder="M. / Mme Dupont"
          disabled={unlocked}
        />
      </div>

      {/* ── Adresse avec autocomplete ── */}
      <div className="form-group" ref={wrapperRef}>
        <label>Adresse exacte du bien <span className="label-required">*</span></label>
        <div className="addr-wrap">
          <input
            type="text"
            className="addr-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="12 rue de la Plage, 85800 Saint-Gilles-Croix-de-Vie"
            autoComplete="off"
            disabled={unlocked}
          />
          {addrLoading && <span className="addr-spinner">⏳</span>}
          {showDropdown && suggestions.length > 0 && (
            <ul className="addr-dropdown">
              {suggestions.map((f, i) => (
                <li key={i} className="addr-option" onMouseDown={() => handleSelect(f)}>
                  <span className="addr-option-icon">📍</span>
                  <span>{f.properties.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {detectedZoneName && !unlocked && (
          <p className="zone-detected">✓ Zone détectée : <strong>{detectedZoneName}</strong></p>
        )}
        {unlocked && property.adresse && (
          <p className="zone-detected">📍 <strong>{property.adresse}</strong></p>
        )}
      </div>

      <div className="form-group">
        <label>N° de téléphone <span className="label-required">*</span></label>
        <input
          type="tel"
          value={property.telephone}
          onChange={e => set('telephone', e.target.value)}
          placeholder="06 00 00 00 00"
          disabled={unlocked}
        />
      </div>

      <div className="form-group">
        <label>Adresse e-mail <span className="label-required">*</span></label>
        <input
          type="email"
          value={property.email}
          onChange={e => set('email', e.target.value)}
          placeholder="vous@exemple.fr"
          disabled={unlocked}
        />
      </div>

      <div className="form-group">
        <label>Style du bien</label>
        <div className="radio-group">
          {STYLES.map(s => (
            <label key={s.value} className={`radio-card ${property.style === s.value ? 'active' : ''}`}>
              <input
                type="radio"
                name="style"
                value={s.value}
                checked={property.style === s.value}
                onChange={() => set('style', s.value)}
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Chambres</label>
          <select value={property.chambres} onChange={e => set('chambres', Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} chambre{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Capacité d'accueil</label>
          <div className="capacity-input">
            <button type="button" onClick={() => set('capacite', Math.max(1, property.capacite - 1))}>−</button>
            <span>{property.capacite} pers.</span>
            <button type="button" onClick={() => set('capacite', Math.min(16, property.capacite + 1))}>+</button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Prestations incluses <span className="label-hint">(impact sur prix &amp; remplissage)</span></label>
        <div className="extras-grid">
          {EXTRAS.map(e => (
            <label key={e.value} className={`extra-chip ${property.extras.includes(e.value) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={property.extras.includes(e.value)}
                onChange={() => toggleExtra(e.value)}
              />
              {e.label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Bouton déverrouillage ── */}
      {!unlocked ? (
        <div className="unlock-block">
          {leadError && <p className="lead-error">{leadError}</p>}
          <button
            className="btn-unlock"
            onClick={onUnlock}
            disabled={sending}
          >
            {sending ? '⏳ Envoi en cours…' : '🔓 Voir le détail de mon prévisionnel'}
          </button>
          <p className="unlock-hint">Accès gratuit · Sans engagement · Résultats immédiats</p>
        </div>
      ) : (
        <div className="unlock-success">
          ✅ Prévisionnel déverrouillé — vous pouvez consulter et exporter votre estimation.
        </div>
      )}
    </div>
  )
}
