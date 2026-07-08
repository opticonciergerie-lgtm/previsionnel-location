import { useState, useMemo } from 'react'

const fmt = n => Math.round(n).toLocaleString('fr-FR')

export default function PerformanceInsights({ forecast, unlocked }) {
  const [charges, setCharges] = useState('')

  // ── Calculs KPI ──────────────────────────────────────────
  const totalRevenue  = forecast.reduce((s, m) => s + m.revenue, 0)
  const totalNights   = forecast.reduce((s, m) => s + m.nightsBooked, 0)

  const bestMonth     = forecast.reduce((b, m) => m.revenue  > b.revenue  ? m : b, forecast[0])
  const worstMonth    = forecast.reduce((w, m) => m.revenue  < w.revenue  ? m : w, forecast[0])
  const peakOccMonth  = forecast.reduce((b, m) => m.occupancyRate > b.occupancyRate ? m : b, forecast[0])

  const avgNightly    = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0
  const revPAN        = Math.round(totalRevenue / 365)
  const avgMonthly    = Math.round(totalRevenue / 12)

  // ── Simulation charges ───────────────────────────────────
  const chargesNum    = parseFloat(charges.replace(',', '.')) || 0
  const annualCharges = chargesNum * 12
  const coverage      = annualCharges > 0 ? (totalRevenue / annualCharges) * 100 : 0
  const coverageCapped = Math.min(coverage, 100)
  const monthsCovered = annualCharges > 0 ? Math.round((totalRevenue / annualCharges) * 12) : 0
  const surplus       = annualCharges > 0 ? Math.round(totalRevenue - annualCharges) : 0

  const coverageColor = coverage >= 100 ? '#10b981' : coverage >= 70 ? '#f59e0b' : '#ef4444'
  const coverageLabel =
    coverage >= 120 ? '🎉 Votre bien est très rentable — les revenus dépassent largement vos charges !' :
    coverage >= 100 ? '✅ Votre bien se finance intégralement grâce à la location saisonnière.' :
    coverage >= 70  ? '📈 La location couvre la majorité de vos charges — un très bon complément.' :
    coverage >= 40  ? '💡 La location couvre une part significative de vos charges mensuelles.' :
                      '📊 La location saisonnière constitue un complément de revenu intéressant.'

  const kpis = [
    {
      icon: '💶',
      label: 'Prix moyen / nuit',
      value: `${fmt(avgNightly)} €`,
      sub: 'Pondéré sur les nuits louées',
      color: '#6abac1',
    },
    {
      icon: '📊',
      label: 'Revenu par nuit dispo',
      value: `${fmt(revPAN)} €`,
      sub: 'RevPAN — base 365 jours',
      color: '#3d9ea6',
    },
    {
      icon: '🏆',
      label: 'Meilleur mois',
      value: bestMonth.month,
      sub: `${fmt(bestMonth.revenue)} € estimés`,
      color: '#10b981',
    },
    {
      icon: '📅',
      label: 'Mois le plus calme',
      value: worstMonth.month,
      sub: `${fmt(worstMonth.revenue)} € estimés`,
      color: '#94a3b8',
    },
    {
      icon: '📈',
      label: 'Pic de remplissage',
      value: `${peakOccMonth.occupancyRate} %`,
      sub: `En ${peakOccMonth.month}`,
      color: '#f59e0b',
    },
    {
      icon: '💰',
      label: 'CA moyen / mois',
      value: `${fmt(avgMonthly)} €`,
      sub: 'Moyenne mensuelle sur 12 mois',
      color: '#8b5cf6',
    },
  ]

  return (
    <div className="insights-section">

      {/* ── En-tête ── */}
      <div className="insights-header">
        <div className="insights-header-text">
          <h2>Analyse de performance</h2>
          <p>Indicateurs clés et simulation de rentabilité basés sur votre prévisionnel</p>
        </div>
      </div>

      <div className={`insights-body ${!unlocked ? 'insights-locked' : ''}`}>

        {/* ── KPI Grid ── */}
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-card" key={i} style={{ '--kpi-color': k.color }}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-content">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-value">{k.value}</span>
                <span className="kpi-sub">{k.sub}</span>
              </div>
              <div className="kpi-accent" />
            </div>
          ))}
        </div>

        {/* ── Séparateur ── */}
        <div className="insights-divider">
          <span>Simulation de rentabilité</span>
        </div>

        {/* ── Simulateur ── */}
        <div className="sim-block">
          <div className="sim-input-area">
            <label className="sim-label">
              💳 Vos charges mensuelles du bien
              <span className="sim-label-hint"> (crédit, taxe foncière, charges de copropriété…)</span>
            </label>
            <div className="sim-input-row">
              <input
                type="number"
                className="sim-input"
                value={charges}
                onChange={e => setCharges(e.target.value)}
                placeholder="ex : 800"
                min="0"
              />
              <span className="sim-input-suffix">€ / mois</span>
            </div>
          </div>

          {chargesNum > 0 && (
            <div className="sim-result">
              {/* Jauge */}
              <div className="sim-gauge-wrap">
                <div className="sim-gauge-track">
                  <div
                    className="sim-gauge-fill"
                    style={{
                      width: `${coverageCapped}%`,
                      background: coverageColor,
                    }}
                  />
                </div>
                <span className="sim-gauge-pct" style={{ color: coverageColor }}>
                  {Math.round(coverage)} %
                </span>
              </div>

              {/* Stats sous la jauge */}
              <div className="sim-stats">
                <div className="sim-stat">
                  <span className="sim-stat-icon">📆</span>
                  <div>
                    <span className="sim-stat-val">{Math.min(monthsCovered, 12)} mois</span>
                    <span className="sim-stat-label">de charges couvertes / an</span>
                  </div>
                </div>
                <div className="sim-stat">
                  <span className="sim-stat-icon">{surplus >= 0 ? '✅' : '⚠️'}</span>
                  <div>
                    <span className="sim-stat-val" style={{ color: surplus >= 0 ? '#10b981' : '#ef4444' }}>
                      {surplus >= 0 ? '+' : ''}{fmt(surplus)} €
                    </span>
                    <span className="sim-stat-label">
                      {surplus >= 0 ? 'de revenus nets au-delà des charges' : 'de charges non couvertes'}
                    </span>
                  </div>
                </div>
                <div className="sim-stat">
                  <span className="sim-stat-icon">💰</span>
                  <div>
                    <span className="sim-stat-val">{fmt(totalRevenue)} €</span>
                    <span className="sim-stat-label">de CA annuel estimé</span>
                  </div>
                </div>
              </div>

              {/* Message contextuel */}
              <div className="sim-message" style={{ borderColor: coverageColor, color: coverageColor }}>
                {coverageLabel}
              </div>
            </div>
          )}

          {!chargesNum && (
            <p className="sim-placeholder">
              Renseignez vos charges mensuelles pour simuler la couverture de votre bien.
            </p>
          )}
        </div>

        {/* ── Overlay verrouillage ── */}
        {!unlocked && (
          <div className="lock-overlay">
            <div className="lock-overlay-content">
              <span className="lock-icon">🔒</span>
              <p className="lock-title">Analyse verrouillée</p>
              <p className="lock-sub">Renseignez vos coordonnées dans le formulaire, puis cliquez sur <strong>« Voir le détail »</strong> pour accéder à cette analyse.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
