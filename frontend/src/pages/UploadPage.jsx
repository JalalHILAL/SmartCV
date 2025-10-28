import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FileUpload from '../components/FileUpload'

export default function UploadPage() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [analysisId, setAnalysisId] = useState(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  const validateFile = (file) => {
    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx'].includes(extension)) {
      return 'Please upload a PDF or DOCX file'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10 MB limit'
    }

    return null
  }

  const handleFileSelect = async (file) => {
    setError('')

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setIsProcessing(true)

    // Upload file
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setAnalysisId(data.analysis_id)
      // Start polling for progress
      pollProgress(data.analysis_id)

    } catch (err) {
      setError(err.message || 'File upload failed. Please check your connection and try again.')
      setIsProcessing(false)
    }
  }

  const pollProgress = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/analysis/${id}/status`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error('Failed to get progress')
        }

        setProgress(data.progress)
        setCurrentStep(data.step)

        // Check if complete
        if (data.progress >= 100 || data.status === 'complete') {
          clearInterval(interval)
          // Redirect to results page
          navigate(`/results?id=${id}`)
        }

        // Check if failed
        if (data.status === 'failed') {
          clearInterval(interval)
          setError(data.error || 'Analysis failed. Please try again or contact support.')
          setIsProcessing(false)
        }

      } catch (err) {
        clearInterval(interval)
        setError('Unable to get analysis status. Please try again.')
        setIsProcessing(false)
      }
    }, 1000) // Poll every second
  }

  const resetUpload = () => {
    setIsProcessing(false)
    setError('')
    setSelectedFile(null)
    setProgress(0)
    setCurrentStep(1)
    setAnalysisId(null)
  }

  const getStepDisplay = (step) => {
    const steps = [
      { label: 'File uploaded', complete: currentStep > 1, current: currentStep === 1 },
      { label: 'Text extracted', complete: currentStep > 2, current: currentStep === 2 },
      { label: 'Running AI analysis', complete: currentStep > 3, current: currentStep === 3 },
      { label: 'Generating report', complete: currentStep > 4, current: currentStep === 4 }
    ]

    return steps.map((s, i) => ({
      ...s,
      icon: s.complete ? '✓' : s.current ? '→' : '⋯'
    }))
  }

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // Warn before leaving during processing
  useEffect(() => {
    if (isProcessing) {
      const handleBeforeUnload = (e) => {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isProcessing])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Header />

      <main className="pt-32 pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              {isProcessing ? 'Analyzing Your CV' : 'Upload Your CV'}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {isProcessing
                ? 'Please wait while we analyze your resume...'
                : 'Get instant AI-powered feedback on your resume'
              }
            </p>
          </div>

          {/* Upload Box or Processing Display */}
          {!isProcessing ? (
            <FileUpload onFileSelect={handleFileSelect} error={error} />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-10">
              {/* File Info */}
              {selectedFile && (
                <div className="flex items-center mb-8 pb-6 border-b-2 border-gray-300 dark:border-gray-700">
                  <span className="text-4xl mr-4">📄</span>
                  <div>
                    <p className="font-bold text-base text-gray-800 dark:text-gray-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Label */}
              <p className="text-lg font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
                Analyzing...
              </p>

              {/* Progress Bar */}
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
                <div
                  className="h-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center transition-all duration-300"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-white font-bold text-sm">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {getStepDisplay(currentStep).map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      step.current ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className="mr-3">{step.icon}</span>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6">
                  <p className="text-red-600 dark:text-red-400 text-center mb-4">
                    {error}
                  </p>
                  <button
                    onClick={resetUpload}
                    className="w-full py-3 px-6 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
