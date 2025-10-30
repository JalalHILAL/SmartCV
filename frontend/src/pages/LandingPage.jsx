import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const features = [
    { icon: '✅', text: t('landing.features.structure') },
    { icon: '🔑', text: t('landing.features.keywords') },
    { icon: '💬', text: t('landing.features.improvements') },
    { icon: '⚠️', text: t('landing.features.grammar') }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Header />

      <main className="pt-32 pb-10 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Section - Hero Content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                {t('landing.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                {t('landing.subtitle')}
              </p>

              {/* Feature List */}
              <div className="space-y-0">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="py-3 border-b border-gray-300 dark:border-gray-700 flex items-center"
                  >
                    <span className="text-xl mr-3">{feature.icon}</span>
                    <span className="text-base text-gray-800 dark:text-gray-200">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Visual & CTA */}
            <div>
              <div className="bg-gray-100 dark:bg-dark-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl p-10">
                {/* Visual Placeholder */}
                <div className="h-72 border-2 border-dashed border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-8">
                  <span className="text-4xl">{t('landing.illustration')}</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/upload')}
                  className="w-full py-4 px-12 bg-blue-600 dark:bg-blue-500 text-white text-lg font-bold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  {t('landing.getStarted')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
