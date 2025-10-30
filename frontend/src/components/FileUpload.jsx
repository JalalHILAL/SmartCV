import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function FileUpload({ onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const { t } = useTranslation()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer rounded-xl p-16 text-center border-3 border-dashed
          ${isDragging
            ? 'bg-gray-200 dark:bg-gray-700 border-gray-500 dark:border-gray-500'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-400 dark:border-gray-600'
          }
        `}
      >
        <div className="text-5xl mb-4">📄</div>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          {t('upload.dragDrop')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('upload.or')}</p>
        <button
          type="button"
          className="px-8 py-3 bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold text-base hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          {t('upload.browseFiles')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* File Requirements */}
      <div className="mt-6 bg-white dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4">
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('upload.fileRequirements')}</p>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>✓ {t('upload.acceptedFormats')}</li>
          <li>✓ {t('upload.maxFileSize')}</li>
          <li>✓ {t('upload.textSelectable')}</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 dark:text-red-400 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  )
}
