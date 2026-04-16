'use client'

export default function MarketHeaderRow() {
  return (
    <div
      className="grid grid-cols-[28px,32px,minmax(0,1.8fr),minmax(96px,1fr),72px,72px,72px,minmax(120px,1.1fr),minmax(120px,1.1fr)] md:grid-cols-[32px,40px,minmax(0,2.4fr),minmax(120px,1fr),80px,80px,80px,minmax(150px,1.1fr),minmax(150px,1.1fr)] items-center gap-3 px-4 py-3 md:px-6 text-xs font-semibold text-slate-500"
    >
      <div></div> {/* Star column */}
      <div>#</div>
      <div>Coin</div>
      <div className="text-right">Price</div>
      <div className="text-right">1h</div>
      <div className="text-right">24h</div>
      <div className="text-right">7d</div>
      <div className="text-right">24h Volume</div>
      <div className="text-right">Market Cap</div>
    </div>
  )
}