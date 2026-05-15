import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const STYLE_LABELS = { classique: 'Classique', luxe: 'Luxe / Premium', atypique: 'Atypique / Original' }
const EXTRA_LABELS = {
  piscine: 'Piscine', vue_mer: 'Vue mer', terrasse: 'Grande terrasse',
  parking: 'Parking', jacuzzi: 'Jacuzzi / Spa', climatisation: 'Climatisation',
}

export default function ForecastTable({ forecast, property }) {
  const totalRevenue = forecast.reduce((s, m) => s + m.revenue, 0)
  const totalNights  = forecast.reduce((s, m) => s + m.nightsBooked, 0)
  const avgOcc       = Math.round(forecast.reduce((s, m) => s + m.occupancyRate, 0) / 12)
  const netRevenue   = Math.round(totalRevenue * 0.80)
  const year         = new Date().getFullYear()

  const exportPDF = () => {
    const doc       = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const margin    = 14

    // ── En-tête bleu ──
    doc.setFillColor(26, 86, 219)
    doc.rect(0, 0, pageWidth, 48, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text('PRÉVISIONNEL DE LOCATION SAISONNIÈRE', pageWidth / 2, 18, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    if (property.adresse)      doc.text(property.adresse, pageWidth / 2, 29, { align: 'center' })
    if (property.proprietaire) doc.text(`Propriétaire : ${property.proprietaire}`, pageWidth / 2, 38, { align: 'center' })

    // ── Fiche bien ──
    let y = 56
    doc.setFillColor(243, 244, 246)
    doc.roundedRect(margin, y, pageWidth - margin * 2, property.extras.length ? 24 : 16, 2, 2, 'F')
    doc.setTextColor(31, 41, 55)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const infoLine = [
      `Zone : ${forecast[0]?.zone ?? property.zone}`,
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
    doc.setTextColor(26, 86, 219)
    doc.text(`PRÉVISIONNEL MENSUEL ${year}`, margin, y)
    y += 5

    // ── Tableau mensuel ──
    autoTable(doc, {
      startY: y,
      head: [['Mois', 'Taux remplissage', 'Prix / nuitée', 'Nuits louées', 'CA Estimé']],
      body: forecast.map(m => [
        m.month,
        `${m.occupancyRate} %`,
        `${m.nightly_price.toLocaleString('fr-FR')} €`,
        `${m.nightsBooked} nuits`,
        `${m.revenue.toLocaleString('fr-FR')} €`,
      ]),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3.5 },
      headStyles: { fillColor: [26, 86, 219], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { halign: 'center', cellWidth: 34 },
        2: { halign: 'right',  cellWidth: 34 },
        3: { halign: 'center', cellWidth: 30 },
        4: { halign: 'right',  fontStyle: 'bold' },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: margin, right: margin },
      // Mise en valeur haute saison (juillet = index 6, août = 7)
      didParseCell: data => {
        if (data.section === 'body' && (data.row.index === 6 || data.row.index === 7)) {
          data.cell.styles.fillColor = [239, 246, 255]
        }
      },
    })

    // ── Récapitulatif annuel ──
    const finalY = doc.lastAutoTable.finalY + 8
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(margin, finalY, pageWidth - margin * 2, 46, 3, 3, 'F')
    doc.setDrawColor(167, 243, 208)
    doc.roundedRect(margin, finalY, pageWidth - margin * 2, 46, 3, 3, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(5, 150, 105)
    doc.text('RÉCAPITULATIF ANNUEL', margin + 4, finalY + 10)

    doc.setFontSize(9.5)
    doc.setTextColor(31, 41, 55)
    const col1 = margin + 4
    const col2 = pageWidth / 2 + 4

    const drawStat = (label, value, x, yPos, bold = false, color = null) => {
      doc.setFont('helvetica', 'normal')
      doc.text(label, x, yPos)
      if (color) doc.setTextColor(...color)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.text(value, x + doc.getTextWidth(label), yPos)
      doc.setTextColor(31, 41, 55)
    }

    drawStat("Taux d'occupation moyen : ", `${avgOcc} %`,               col1, finalY + 22)
    drawStat("Nuits louées / an : ",       `${totalNights} nuits`,       col1, finalY + 33)
    drawStat("CA brut estimé : ",          `${totalRevenue.toLocaleString('fr-FR')} €`, col2, finalY + 22)
    drawStat("Revenu net (après 20 %) : ", `${netRevenue.toLocaleString('fr-FR')} €`,   col2, finalY + 33, true, [5, 150, 105])

    // ── Pied de page ──
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Estimation établie le ${new Date().toLocaleDateString('fr-FR')} · Les résultats réels peuvent varier selon le marché et la gestion du bien.`,
      pageWidth / 2, 287, { align: 'center' }
    )

    const slug = (property.proprietaire || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '_')
    doc.save(`previsionnel_${slug}_${year}.pdf`)
  }

  return (
    <div className="forecast-table-section">
      <div className="section-header">
        <h2>Prévisionnel mensuel {year}</h2>
        <button className="btn-export" onClick={exportPDF}>↓ Exporter PDF</button>
      </div>

      <div className="table-wrapper">
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
      </div>
    </div>
  )
}
