import { useState, useMemo, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import PropertyForm from './components/PropertyForm.jsx'
import ForecastTable from './components/ForecastTable.jsx'
import AnnualSummary from './components/AnnualSummary.jsx'
import { computeForecast } from './utils/calculations.js'
import { fetchSheetData, SHEET_COLUMNS } from './utils/googleSheets.js'
import { defaultData } from './data/defaultData.js'
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from './config/emailjs.js'

const STYLE_LABELS   = { classique: 'Classique', luxe: 'Luxe / Premium', atypique: 'Atypique / Original' }
const FORMULE_LABELS = { autonome: 'Entrée autonome (20%)', presentielle: 'Entrée présentielle (24%)' }
const EXTRA_LABELS   = { piscine: 'Piscine', vue_mer: 'Vue mer', jardin: 'Jardin', parking: 'Parking', jacuzzi: 'Jacuzzi / Spa' }

export default function App() {
  const [property, setProperty] = useState({
    proprietaire: '',
    adresse: '',
    telephone: '',
    email: '',
    zone: 'bord-mer',
    style: 'classique',
    chambres: 2,
    capacite: 4,
    extras: [],
    formule: 'autonome',
  })

  const [unlocked,        setUnlocked]        = useState(false)
  const [sendingLead,     setSendingLead]      = useState(false)
  const [leadError,       setLeadError]        = useState('')

  const [referenceData, setReferenceData]   = useState(defaultData)
  const [sheetUrl, setSheetUrl]             = useState(() => localStorage.getItem('sheetUrl') ?? '')
  const [sheetStatus, setSheetStatus]       = useState('')
  const [showSettings, setShowSettings]     = useState(false)
  const [loading, setLoading]               = useState(false)

  const forecast       = useMemo(() => computeForecast(property, referenceData), [property, referenceData])
  const zoneName       = useMemo(
    () => referenceData.find(r => r.zone === property.zone)?.zoneName ?? property.zone,
    [referenceData, property.zone]
  )
  const commissionRate = property.formule === 'presentielle' ? 0.24 : 0.20

  // ── Déverrouillage + envoi du lead ──
  const handleUnlock = useCallback(async () => {
    const phone = property.telephone.trim()
    const mail  = property.email.trim()

    if (!phone) { setLeadError('Veuillez saisir votre numéro de téléphone.'); return }
    if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setLeadError('Veuillez saisir une adresse e-mail valide.'); return
    }

    setLeadError('')
    setSendingLead(true)

    const extrasStr = property.extras.length
      ? property.extras.map(e => EXTRA_LABELS[e] ?? e).join(', ')
      : 'Aucune'

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          proprietaire: property.proprietaire || '(non renseigné)',
          adresse:      property.adresse      || '(non renseignée)',
          telephone:    phone,
          email:        mail,
          zone:         zoneName,
          style:        STYLE_LABELS[property.style]   ?? property.style,
          chambres:     `${property.chambres} chambre${property.chambres > 1 ? 's' : ''}`,
          capacite:     `${property.capacite} personnes`,
          extras:       extrasStr,
          formule:      FORMULE_LABELS[property.formule] ?? property.formule,
        },
        EMAILJS_PUBLIC_KEY
      )
    } catch (err) {
      // On déverrouille quand même — l'email est secondaire,
      // le prospect ne doit pas être bloqué par un problème réseau
      console.warn('EmailJS error:', err)
    }

    setSendingLead(false)
    setUnlocked(true)
  }, [property, zoneName])

  // Quand le formulaire change, si la personne modifie téléphone/email on re-verrouille
  const handlePropertyChange = useCallback((next) => {
    if (
      unlocked &&
      (next.telephone !== property.telephone || next.email !== property.email)
    ) {
      setUnlocked(false)
    }
    setProperty(next)
  }, [unlocked, property.telephone, property.email])

  const handleLoadSheet = useCallback(async () => {
    if (!sheetUrl.trim()) return
    setLoading(true)
    setSheetStatus('')
    try {
      const data = await fetchSheetData(sheetUrl.trim())
      setReferenceData(data)
      localStorage.setItem('sheetUrl', sheetUrl.trim())
      setSheetStatus(`✓ ${data.length} ligne(s) chargée(s) avec succès`)
    } catch (e) {
      setSheetStatus(`✗ Erreur : ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [sheetUrl])

  const handleResetData = () => {
    setReferenceData(defaultData)
    setSheetStatus('Données par défaut restaurées.')
  }

  const scrollToEstimation = (e) => {
    e.preventDefault()
    document.getElementById('estimation')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">

      {/* ── Barre d'information ── */}
      <div className="top-bar">
        <div className="top-bar-content">
          <span>🕐 Lundi – Dimanche · 8h–19h</span>
          <span>📞 <a href="tel:0780531313">07 80 53 13 13</a></span>
          <span>✉ <a href="mailto:opti.conciergerie@gmail.com">opti.conciergerie@gmail.com</a></span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="hero">
        <div className="hero-overlay">

          {/* Nav dans le hero */}
          <nav className="hero-nav">
            <img src="/logo.png" alt="Opti Conciergerie" className="hero-logo" />
            <button className="btn-settings-hero" onClick={() => setShowSettings(v => !v)}>
              ⚙ Paramètres
            </button>
          </nav>

          {/* Contenu central */}
          <div className="hero-content">
            <p className="hero-eyebrow">Opti Conciergerie · Estimation gratuite</p>
            <h1>
              Calculez le potentiel de votre bien<br />
              <span className="hero-accent">en location saisonnière</span>
            </h1>
            <p className="hero-sub">
              Renseignez les caractéristiques de votre logement et obtenez en quelques secondes
              une projection mensuelle réaliste de votre chiffre d'affaires.
            </p>
            <div className="hero-ctas">
              <a href="#estimation" className="btn-hero-primary" onClick={scrollToEstimation}>
                Commencer l'estimation →
              </a>
              <a href="tel:0780531313" className="btn-hero-secondary">
                📞 Nous contacter
              </a>
              <a href="https://opti-conciergerie.com" target="_blank" rel="noreferrer" className="btn-hero-ghost">
                Voir notre site
              </a>
            </div>
          </div>

          {/* Badges de confiance */}
          <div className="hero-badges">
            <span className="badge">✓ 100% gratuit</span>
            <span className="badge">✓ Sans engagement</span>
            <span className="badge">✓ Résultats instantanés</span>
            <span className="badge">✓ Export PDF inclus</span>
          </div>

        </div>
      </header>

      {/* ── Panneau paramètres ── */}
      {showSettings && (
        <div className="settings-panel">
          <h3>🔗 Connecter votre Google Sheet</h3>
          <p>
            Publiez votre feuille (<em>Fichier → Partager → Publier sur le web → CSV</em>) et collez l'URL ci-dessous.
            Colonnes attendues : <code>{SHEET_COLUMNS.join(', ')}</code>
          </p>
          <div className="settings-row">
            <input
              type="url"
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv&gid=0"
              className="sheet-url-input"
            />
            <button className="btn-primary" onClick={handleLoadSheet} disabled={loading}>
              {loading ? 'Chargement…' : 'Charger'}
            </button>
          </div>
          {sheetStatus && <p className={`sheet-status ${sheetStatus.startsWith('✓') ? 'ok' : sheetStatus.startsWith('✗') ? 'err' : ''}`}>{sheetStatus}</p>}
          <button className="btn-link" onClick={handleResetData}>↩ Revenir aux données par défaut</button>
        </div>
      )}

      {/* ── Contenu principal ── */}
      <main id="estimation" className="app-main">
        <aside className="form-panel">
          <PropertyForm
            property={property}
            onChange={handlePropertyChange}
            referenceData={referenceData}
            unlocked={unlocked}
            onUnlock={handleUnlock}
            sending={sendingLead}
            leadError={leadError}
          />
        </aside>

        <section className="results-panel">
          {forecast ? (
            <>
              <AnnualSummary forecast={forecast} commissionRate={commissionRate} unlocked={unlocked} />
              <ForecastTable
                forecast={forecast}
                property={property}
                zoneName={zoneName}
                commissionRate={commissionRate}
                unlocked={unlocked}
              />
            </>
          ) : (
            <div className="no-data">
              <p>⚠ Aucune donnée disponible pour cette combinaison zone / style.</p>
              <p>Vérifiez vos données de référence dans les paramètres.</p>
            </div>
          )}
        </section>
      </main>

      {/* ── CTA Contact ── */}
      <section className="cta-section">
        <div className="cta-block">
          <div className="cta-left">
            <p className="cta-eyebrow">Vous souhaitez en savoir plus ?</p>
            <h2 className="cta-title">Contactez-nous<br />dès maintenant.</h2>
            <p className="cta-sub">
              Échangeons sur votre bien ou votre projet de location.<br />
              Nous sommes joignables 7j/7, par téléphone ou par mail.
            </p>
          </div>
          <div className="cta-right">
            <a href="tel:0780531313" className="cta-card">
              <span className="cta-card-icon phone">📞</span>
              <div>
                <span className="cta-card-label">Téléphone</span>
                <span className="cta-card-value">07 80 53 13 13</span>
              </div>
              <span className="cta-card-arrow">›</span>
            </a>
            <a href="mailto:opti.conciergerie@gmail.com" className="cta-card">
              <span className="cta-card-icon mail">✉</span>
              <div>
                <span className="cta-card-label">Email</span>
                <span className="cta-card-value">opti.conciergerie@gmail.com</span>
              </div>
              <span className="cta-card-arrow">›</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="footer-content">
          <img src="/logo.png" alt="Opti Conciergerie" className="footer-logo" />
          <div className="footer-links">
            <a href="https://opti-conciergerie.com" target="_blank" rel="noreferrer">opti-conciergerie.com</a>
            <a href="tel:0780531313">07 80 53 13 13</a>
            <a href="mailto:opti.conciergerie@gmail.com">opti.conciergerie@gmail.com</a>
          </div>
          <p className="footer-legal">Les estimations fournies sont indicatives et basées sur les données du marché local.</p>
        </div>
      </footer>

    </div>
  )
}
