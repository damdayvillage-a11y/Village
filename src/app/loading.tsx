export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl animate-pulse">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Loading Damday Village
        </h2>
        <p className="text-gray-600 mb-6">
          Preparing your sustainable journey...
        </p>
        
        {/* Loading Progress Bar */}
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>
        
        {/* Loading Stats */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div className="text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1 animate-pulse"></div>
            <span>Solar Grid</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1 animate-pulse"></div>
            <span>IoT Sensors</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-1 animate-pulse"></div>
            <span>Digital Twin</span>
          </div>
        </div>
      </div>
    </div>
  );
}