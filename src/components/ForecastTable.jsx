import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const STYLE_LABELS = { classique: 'Classique', luxe: 'Luxe / Premium', atypique: 'Atypique / Original' }
const EXTRA_LABELS = {
  piscine: 'Piscine', vue_mer: 'Vue mer', jardin: 'Jardin',
  parking: 'Parking', jacuzzi: 'Jacuzzi / Spa',
}

// Formatage des montants sans espace insécable (évite le bug "/" dans jsPDF)
const fmtEur = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €'

const TEAL = [106, 186, 193]

const loadImage = src => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = () => resolve(img)
  img.onerror = reject
  img.src = src
})

export default function ForecastTable({ forecast, property, zoneName, unlocked, conciergerieRate }) {
  const totalRevenue = forecast.reduce((s, m) => s + m.revenue, 0)
  const totalNights  = forecast.reduce((s, m) => s + m.nightsBooked, 0)
  const avgOcc       = Math.round(forecast.reduce((s, m) => s + m.occupancyRate, 0) / 12)
  const year         = new Date().getFullYear()

  const exportPDF = async () => {
    if (!unlocked) return

    const doc       = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const margin    = 14

    // ── Logo ──
    let logoImg = null
    try { logoImg = await loadImage('/logo.png') } catch (_) { /* logo absent, on ignore */ }

    // ── En-tête teal (titre + propriétaire + adresse) ──
    doc.setFillColor(...TEAL)
    doc.rect(0, 0, pageWidth, 38, 'F')

    if (logoImg) {
      doc.addImage(logoImg, 'PNG', margin, 6, 28, 28)
    }

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('PRÉVISIONNEL DE LOCATION SAISONNIÈRE', pageWidth / 2, 17, { align: 'center' })

    doc.setFontSize(10)
    const ownerLine = [property.proprietaire, property.adresse].filter(Boolean).join('   –   ')
    doc.text(ownerLine, pageWidth / 2, 30, { align: 'center' })

    let y = 40

    // ── Fiche bien ──
    doc.setFillColor(243, 244, 246)
    doc.roundedRect(margin, y, pageWidth - margin * 2, property.extras.length ? 24 : 16, 2, 2, 'F')
    doc.setTextColor(31, 41, 55)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const infoLine = [
      `Zone : ${zoneName ?? property.zone}`,
      `Style : ${STYLE_LABELS[property.style] ?? property.style}`,
      `${property.chambres} chambre${property.chambres > 1 ? 's' : ''}`,
      `${property.capacite} personnes`,
    ].join('   ·   ')
    doc.text(infoLine, margin + 4, y + 8)
    if (property.extras.length) {
      doc.setFont('helvetica', 'normal')
      doc.text(`Prestations : ${property.extras.map(e => EXTRA_LABELS[e] ?? e).join(', ')}`, margin + 4, y + 19)
    }
    y += property.extras.length ? 32 : 24

    // ── Titre tableau ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...TEAL)
    doc.text(`PRÉVISIONNEL MENSUEL ${year}`, margin, y)
    y += 5

    // ── Tableau mensuel ──
    autoTable(doc, {
      startY: y,
      head: [['Mois', 'Taux remplissage', 'Prix / nuitée', 'Nuits louées', 'CA Estimé']],
      body: forecast.map(m => [
        m.month,
        `${m.occupancyRate} %`,
        fmtEur(m.nightly_price),
        `${m.nightsBooked} nuits`,
        fmtEur(m.revenue),
      ]),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3.5 },
      headStyles: { fillColor: TEAL, textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { halign: 'center', cellWidth: 34 },
        2: { halign: 'right',  cellWidth: 34 },
        3: { halign: 'center', cellWidth: 30 },
        4: { halign: 'right',  fontStyle: 'bold' },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: margin, right: margin },
      didParseCell: data => {
        if (data.section === 'body' && (data.row.index === 6 || data.row.index === 7)) {
          data.cell.styles.fillColor = [224, 247, 248]
        }
      },
    })

    // ── Récapitulatif annuel ──
    const finalY    = doc.lastAutoTable.finalY + 8
    const pct       = conciergerieRate ?? 20
    const netRevPDF = Math.round(totalRevenue * 0.84 * (1 - pct / 100))
    const fraisPDF  = totalRevenue - netRevPDF

    doc.setFillColor(224, 247, 248)
    doc.roundedRect(margin, finalY, pageWidth - margin * 2, 54, 3, 3, 'F')
    doc.setDrawColor(...TEAL)
    doc.roundedRect(margin, finalY, pageWidth - margin * 2, 54, 3, 3, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...TEAL)
    doc.text('RÉCAPITULATIF ANNUEL', margin + 4, finalY + 10)

    doc.setFontSize(9.5)
    doc.setTextColor(31, 41, 55)
    const col1 = margin + 4
    const col2 = pageWidth / 2 + 4

    // label à gauche, valeur alignée à droite de la page
    const drawRight = (label, value, yPos, bold = false, color = null) => {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(31, 41, 55)
      doc.text(label, col2, yPos)
      if (color) doc.setTextColor(...color)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.text(value, pageWidth - margin, yPos, { align: 'right' })
      doc.setTextColor(31, 41, 55)
    }

    // col gauche : stats occupation
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(31, 41, 55)
    doc.text(`Taux d'occupation moyen : ${avgOcc} %`,   col1, finalY + 20)
    doc.text(`Nuits louées / an : ${totalNights} nuits`, col1, finalY + 30)

    // col droite : financier
    drawRight("CA brut estimé :",                       fmtEur(totalRevenue), finalY + 20)
    drawRight(`Frais location (≈16% + ${pct}%) :`,      fmtEur(fraisPDF),     finalY + 30)
    drawRight("Résultat net estimé :",                  fmtEur(netRevPDF),    finalY + 40, true, TEAL)

    // ── Pied de page ──
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Estimation établie le ${new Date().toLocaleDateString('fr-FR')} · Les résultats réels peuvent varier selon le marché, la localisation exacte et la stratégie de location.`,
      pageWidth / 2, 291, { align: 'center' }
    )

    const slug = (property.proprietaire || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '_')
    doc.save(`previsionnel_${slug}_${year}.pdf`)
  }

  return (
    <div className="forecast-table-section">
      <div className="section-header">
        <h2>Prévisionnel mensuel {year}</h2>
        <button
          className={`btn-export ${!unlocked ? 'btn-export-locked' : ''}`}
          onClick={exportPDF}
          title={unlocked ? 'Exporter en PDF' : 'Renseignez vos coordonnées pour déverrouiller'}
        >
          {unlocked ? '↓ Exporter PDF' : '🔒 Exporter PDF'}
        </button>
      </div>

      {/* Wrapper avec overlay flou si non déverrouillé */}
      <div className={`table-wrapper ${!unlocked ? 'table-locked' : ''}`}>
        <div className="table-scroll">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Mois</th>
              <th>Taux remplissage</th>
              <th>Prix / nuitée</th>
              <th>Nuits louées</th>
              <th>CA Estimé</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((m, i) => (
              <tr key={m.month} className={[i % 2 === 0 ? 'even' : '', i === 6 || i === 7 ? 'peak' : ''].join(' ').trim()}>
                <td className="month-cell">{m.month}</td>
                <td>
                  <div className="occ-bar">
                    <div className="occ-track">
                      <div className="occ-fill" style={{ width: `${m.occupancyRate}%` }} />
                    </div>
                    <span>{m.occupancyRate} %</span>
                  </div>
                </td>
                <td className="price-cell">{m.nightly_price.toLocaleString('fr-FR')} €</td>
                <td className="nights-cell">{m.nightsBooked} nuits</td>
                <td className="revenue-cell">{m.revenue.toLocaleString('fr-FR')} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan={2}>Total annuel — moy. {avgOcc} % de remplissage</td>
              <td />
              <td className="nights-cell">{totalNights} nuits</td>
              <td className="revenue-cell">{totalRevenue.toLocaleString('fr-FR')} €</td>
            </tr>
          </tfoot>
        </table>

        </div>{/* fin table-scroll */}

        {/* Overlay de verrouillage */}
        {!unlocked && (
          <div className="lock-overlay">
            <div className="lock-overlay-content">
              <span className="lock-icon">🔒</span>
              <p className="lock-title">Prévisionnel verrouillé</p>
              <p className="lock-sub">Renseignez vos coordonnées dans le formulaire, puis cliquez sur <strong>« Voir le détail »</strong> pour accéder gratuitement à votre estimation complète.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
