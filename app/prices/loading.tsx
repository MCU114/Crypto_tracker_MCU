export default function PricesLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl mb-8">
        <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Price table skeleton */}
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl bg-white rounded-lg shadow overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded w-12 animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded w-20 animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded w-12 animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Table rows */}
        {[...Array(15)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-100">
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 bg-slate-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-14 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-18 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}