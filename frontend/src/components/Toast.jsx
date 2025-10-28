export default function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gray-800 bg-opacity-90 text-white px-6 py-3 rounded-lg shadow-lg text-sm">
        {message}
      </div>
    </div>
  )
}
