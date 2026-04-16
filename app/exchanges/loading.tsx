export default function ExchangesLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header skeleton */}
        <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-10 bg-slate-200 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded w-28 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex mt-6">
          {/* Sidebar skeleton */}
          <div className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-slate-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Mobile filters button */}
              <div className="lg:hidden mb-4">
                <div className="h-10 bg-slate-200 rounded-xl w-20 animate-pulse"></div>
              </div>

              {/* Exchange cards skeleton */}
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                        <div>
                          <div className="h-6 bg-slate-200 rounded w-32 mb-1 animate-pulse"></div>
                          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                      <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-10 bg-slate-200 rounded-xl flex-1 animate-pulse"></div>
                      <div className="h-10 bg-slate-200 rounded-xl flex-1 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}