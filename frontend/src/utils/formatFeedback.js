export function formatFeedbackForClipboard(analysisData) {
  const date = new Date().toLocaleDateString()
  let text = `SMART CV CHECKER - ANALYSIS REPORT\n`
  text += `Generated: ${date}\n`
  text += `Overall Score: ${analysisData.overall_score}/10\n\n`

  text += `${'='.repeat(40)}\n`
  text += `STRENGTHS\n`
  text += `${'='.repeat(40)}\n`
  analysisData.strengths.forEach(item => {
    text += `• ${item}\n`
  })
  text += `\n`

  text += `${'='.repeat(40)}\n`
  text += `WEAK POINTS\n`
  text += `${'='.repeat(40)}\n`
  analysisData.weak_points.forEach(item => {
    text += `• ${item}\n`
  })
  text += `\n`

  text += `${'='.repeat(40)}\n`
  text += `MISSING KEYWORDS\n`
  text += `${'='.repeat(40)}\n`
  text += analysisData.missing_keywords.join(', ') + '\n\n'

  text += `${'='.repeat(40)}\n`
  text += `SUGGESTED IMPROVEMENTS\n`
  text += `${'='.repeat(40)}\n`
  analysisData.suggestions.forEach(item => {
    text += `• ${item}\n`
  })

  return text
}
