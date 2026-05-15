export default function AnnualSummary({ forecast, commissionRate }) {
  const totalRevenue = forecast.reduce((s, m) => s + m.revenue, 0)
  const totalNights  = forecast.reduce((s, m) => s + m.nightsBooked, 0)
  const avgOcc       = Math.round(forecast.reduce((s, m) => s + m.occupancyRate, 0) / 12)
  const netRevenue   = Math.round(totalRevenue * (1 - commissionRate))
  const pct          = Math.round(commissionRate * 100)

  return (
    <div className="annual-summary">
      <div className="summary-card">
        <span className="card-label">Taux moyen annuel</span>
        <span className="card-value primary">{avgOcc}%</span>
      </div>
      <div className="summary-card">
        <span className="card-label">Nuits louées / an</span>
        <span className="card-value">{totalNights}</span>
      </div>
      <div className="summary-card">
        <span className="card-label">CA Brut estimé</span>
        <span className="card-value">{totalRevenue.toLocaleString('fr-FR')} €</span>
      </div>
      <div className="summary-card highlight">
        <span className="card-label">Revenu net (après {pct}%)</span>
        <span className="card-value green">{netRevenue.toLocaleString('fr-FR')} €</span>
      </div>
    </div>
  )
}
