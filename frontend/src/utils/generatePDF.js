import { jsPDF } from 'jspdf'

export function generatePDF(analysisData) {
  const doc = new jsPDF()

  // Add header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Smart CV Checker - Analysis Report', 105, 20, { align: 'center' })

  // Add date
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' })

  // Add score
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Overall Score: ${analysisData.overall_score}/10`, 105, 40, { align: 'center' })

  let yPos = 60

  // Strengths section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('STRENGTHS', 20, yPos)
  yPos += 7
  doc.setLineWidth(0.5)
  doc.line(20, yPos, 190, yPos)
  yPos += 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysisData.strengths.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, 170)
    doc.text(lines, 20, yPos)
    yPos += lines.length * 7
  })
  yPos += 5

  // Weak Points section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('WEAK POINTS', 20, yPos)
  yPos += 7
  doc.line(20, yPos, 190, yPos)
  yPos += 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysisData.weak_points.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, 170)
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.text(lines, 20, yPos)
    yPos += lines.length * 7
  })
  yPos += 5

  // Missing Keywords section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('MISSING KEYWORDS', 20, yPos)
  yPos += 7
  doc.line(20, yPos, 190, yPos)
  yPos += 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const keywordsText = analysisData.missing_keywords.join(', ')
  const keywordsLines = doc.splitTextToSize(keywordsText, 170)
  doc.text(keywordsLines, 20, yPos)
  yPos += keywordsLines.length * 7 + 5

  // Suggestions section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('SUGGESTED IMPROVEMENTS', 20, yPos)
  yPos += 7
  doc.line(20, yPos, 190, yPos)
  yPos += 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysisData.suggestions.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, 170)
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.text(lines, 20, yPos)
    yPos += lines.length * 7
  })

  // Save file
  const filename = `CV_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
