export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          🎉 SLVFX Job Board - Demo Mode
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">✅ What's Working</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Next.js 14 App Router</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>TypeScript Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Tailwind CSS Styling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Job Listing API (Demo)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Authentication API (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Saved Jobs API (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Search & Filtering</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Pagination</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Demo Features</h3>
          <ul className="text-blue-700 space-y-2 text-left">
            <li>• <strong>6 Demo Jobs</strong> - Real job listings for testing</li>
            <li>• <strong>Search Functionality</strong> - Search by title, company, or description</li>
            <li>• <strong>Category Filtering</strong> - Filter by job categories</li>
            <li>• <strong>Source Filtering</strong> - Filter by job sources (RemoteOK, WeWorkRemotely, etc.)</li>
            <li>• <strong>Sorting</strong> - Sort by relevance or date</li>
            <li>• <strong>Save Jobs</strong> - Click heart icons to save jobs (demo mode)</li>
            <li>• <strong>Pagination</strong> - Navigate through job listings</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Demo Mode Notice</h3>
          <p className="text-yellow-700">
            This is running in <strong>demo mode</strong> without a database. All data is stored in memory and will reset when you restart the server. 
            To use the full version with real job scraping, you'll need to set up a PostgreSQL database.
          </p>
        </div>

        <div className="space-y-4">
          <a 
            href="/" 
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            🏠 Go to Job Board
          </a>
          
          <div className="text-sm text-gray-500">
            <p>Visit <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code> to see the job board</p>
          </div>
        </div>
      </div>
    </div>
  )
} 