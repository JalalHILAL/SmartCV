import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700 px-10 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
          {t('header.title')}
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
