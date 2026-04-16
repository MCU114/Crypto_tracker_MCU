export default function ChartsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl mb-8">
        <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Coin selector skeleton */}
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <div className="h-10 bg-slate-200 rounded-xl w-24 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded-xl w-24 animate-pulse"></div>
        </div>

        {/* Timeframe selector skeleton */}
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-200 rounded-xl w-12 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-slate-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="h-96 bg-slate-100 rounded animate-pulse"></div>
      </div>
    </div>
  );
}