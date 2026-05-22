import { useMemo } from 'react'

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
  const zones = useMemo(() => {
    const seen = new Set()
    return referenceData
      .filter(r => { const k = r.zone; if (seen.has(k)) return false; seen.add(k); return true })
      .map(r => ({ value: r.zone, label: r.zoneName }))
  }, [referenceData])

  const set = (key, value) => onChange({ ...property, [key]: value })

  const toggleExtra = extra => {
    const next = property.extras.includes(extra)
      ? property.extras.filter(e => e !== extra)
      : [...property.extras, extra]
    set('extras', next)
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

      <div className="form-group">
        <label>Adresse du bien <span className="label-required">*</span></label>
        <input
          type="text"
          value={property.adresse}
          onChange={e => set('adresse', e.target.value)}
          placeholder="12 rue de la Plage, Les Sables d'Olonne"
          disabled={unlocked}
        />
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
        <label>Zone</label>
        <select value={property.zone} onChange={e => set('zone', e.target.value)}>
          {zones.map(z => (
            <option key={z.value} value={z.value}>{z.label}</option>
          ))}
        </select>
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

      <div className="form-group formule-group">
        <label>Formule choisie</label>
        <div className="radio-group">
          <label className={`radio-card ${property.formule === 'autonome' ? 'active' : ''}`}>
            <input
              type="radio"
              name="formule"
              value="autonome"
              checked={property.formule === 'autonome'}
              onChange={() => set('formule', 'autonome')}
            />
            <div>
              <span className="formule-nom">Entrée autonome</span>
              <span className="formule-taux">20% ttc de commission</span>
            </div>
          </label>
          <label className={`radio-card ${property.formule === 'presentielle' ? 'active' : ''}`}>
            <input
              type="radio"
              name="formule"
              value="presentielle"
              checked={property.formule === 'presentielle'}
              onChange={() => set('formule', 'presentielle')}
            />
            <div>
              <span className="formule-nom">Entrée présentielle</span>
              <span className="formule-taux">24% ttc de commission</span>
            </div>
          </label>
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
