export default function AssetsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl mb-8">
        <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Asset cards grid skeleton */}
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-slate-200 rounded-full mr-4 animate-pulse"></div>
              <div>
                <div className="h-6 bg-slate-200 rounded w-24 mb-1 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-14 animate-pulse"></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="h-8 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}