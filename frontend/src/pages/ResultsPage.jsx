import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Toast from '../components/Toast'
import { formatFeedbackForClipboard } from '../utils/formatFeedback'
import { generatePDF } from '../utils/generatePDF'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const analysisId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (!analysisId) {
      navigate('/')
      return
    }

    fetchAnalysisResults()
  }, [analysisId])

  const fetchAnalysisResults = async () => {
    try {
      const response = await fetch(`/api/analysis/${analysisId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load results')
      }

      setAnalysisData(data)
      setLoading(false)
    } catch (err) {
      setError(err.message || t('results.errors.loadFailed'))
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    if (analysisData) {
      generatePDF(analysisData)
    }
  }

  const handleCopyFeedback = async () => {
    if (analysisData) {
      const formattedText = formatFeedbackForClipboard(analysisData)
      await navigator.clipboard.writeText(formattedText)
      setToastMessage(t('results.toastCopied'))
      setTimeout(() => setToastMessage(''), 3000)
    }
  }

  const handleAnalyzeAnother = () => {
    navigate('/upload')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg">
        <Header />
        <main className="pt-32 pb-10 px-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('results.loading')}</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg">
        <Header />
        <main className="pt-32 pb-10 px-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchAnalysisResults}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                {t('results.retry')}
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                {t('results.goToUpload')}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Header />

      <main className="pt-32 pb-10 px-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              {t('results.title')}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              {t('results.subtitle')}
            </p>

            {/* Overall Score Badge */}
            <div className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-lg">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                {t('results.overallScore')}: {analysisData.overall_score}/10
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              {t('results.downloadReport')}
            </button>
            <button
              onClick={handleCopyFeedback}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              {t('results.copyFeedback')}
            </button>
            <button
              onClick={handleAnalyzeAnother}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              {t('results.analyzeAnother')}
            </button>
          </div>

          {/* Feedback Sections */}

          {/* Strengths Section */}
          <div className="bg-gray-100 dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300 dark:border-gray-700 mb-4">
              <span className="text-3xl">✅</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('results.strengths')}</h2>
            </div>
            <div className="space-y-0">
              {analysisData.strengths.map((item, index) => (
                <div
                  key={index}
                  className={`py-3 text-gray-800 dark:text-gray-200 ${
                    index < analysisData.strengths.length - 1 ? 'border-b border-gray-300 dark:border-gray-700' : ''
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Weak Points Section */}
          <div className="bg-gray-100 dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300 dark:border-gray-700 mb-4">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('results.weakPoints')}</h2>
            </div>
            <div className="space-y-0">
              {analysisData.weak_points.map((item, index) => (
                <div
                  key={index}
                  className={`py-3 text-gray-800 dark:text-gray-200 ${
                    index < analysisData.weak_points.length - 1 ? 'border-b border-gray-300 dark:border-gray-700' : ''
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords Section */}
          <div className="bg-gray-100 dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300 dark:border-gray-700 mb-4">
              <span className="text-3xl">🔑</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('results.missingKeywords')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisData.missing_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-full text-sm text-gray-800 dark:text-gray-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="bg-gray-100 dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300 dark:border-gray-700 mb-4">
              <span className="text-3xl">💬</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('results.suggestions')}</h2>
            </div>
            <div className="space-y-0">
              {analysisData.suggestions.map((item, index) => (
                <div
                  key={index}
                  className={`py-3 text-gray-800 dark:text-gray-200 ${
                    index < analysisData.suggestions.length - 1 ? 'border-b border-gray-300 dark:border-gray-700' : ''
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Toast message={toastMessage} />
    </div>
  )
}
