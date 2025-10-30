import { useTranslation } from 'react-i18next'

export default function LanguageSelector() {
  const { i18n, t } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('language', languageCode)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {currentLanguage.code.toUpperCase()}
        </span>
        <span className="text-xs">▼</span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              lang.code === i18n.language ? 'bg-gray-50 dark:bg-gray-750' : ''
            } first:rounded-t-lg last:rounded-b-lg`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {lang.name}
            </span>
            {lang.code === i18n.language && (
              <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
