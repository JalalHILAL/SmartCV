import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-300 border-2 border-gray-400 dark:bg-gray-700 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
