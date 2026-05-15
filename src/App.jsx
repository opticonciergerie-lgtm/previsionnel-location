import { useState, useMemo, useCallback } from 'react'
import PropertyForm from './components/PropertyForm.jsx'
import ForecastTable from './components/ForecastTable.jsx'
import AnnualSummary from './components/AnnualSummary.jsx'
import { computeForecast } from './utils/calculations.js'
import { fetchSheetData, SHEET_COLUMNS } from './utils/googleSheets.js'
import { defaultData } from './data/defaultData.js'

export default function App() {
  const [property, setProperty] = useState({
    proprietaire: '',
    adresse: '',
    zone: 'bord-mer',
    style: 'classique',
    chambres: 2,
    capacite: 4,
    extras: [],
    formule: 'autonome',
  })

  const [referenceData, setReferenceData] = useState(defaultData)
  const [sheetUrl, setSheetUrl]     = useState(() => localStorage.getItem('sheetUrl') ?? '')
  const [sheetStatus, setSheetStatus] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)

  const forecast        = useMemo(() => computeForecast(property, referenceData), [property, referenceData])
  const zoneName        = useMemo(
    () => referenceData.find(r => r.zone === property.zone)?.zoneName ?? property.zone,
    [referenceData, property.zone]
  )
  const commissionRate  = property.formule === 'presentielle' ? 0.24 : 0.20

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

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <img src="/logo.png" alt="Opti Conciergerie" className="header-logo" />
            <div>
              <h1>Prévisionnel Location Saisonnière</h1>
              <p>Estimation personnalisée · Vendée Littoral</p>
            </div>
          </div>
          <button className="btn-settings" onClick={() => setShowSettings(v => !v)}>
            ⚙ Paramètres
          </button>
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
      <main className="app-main">
        <aside className="form-panel">
          <PropertyForm
            property={property}
            onChange={setProperty}
            referenceData={referenceData}
          />
        </aside>

        <section className="results-panel">
          {forecast ? (
            <>
              <AnnualSummary forecast={forecast} commissionRate={commissionRate} />
              <ForecastTable forecast={forecast} property={property} zoneName={zoneName} commissionRate={commissionRate} />
            </>
          ) : (
            <div className="no-data">
              <p>⚠ Aucune donnée disponible pour cette combinaison zone / style.</p>
              <p>Vérifiez vos données de référence dans les paramètres.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
