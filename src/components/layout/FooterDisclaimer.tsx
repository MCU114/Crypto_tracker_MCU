'use client'

export default function FooterDisclaimer() {
  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-slate-900 mb-3">Disclaimer</h3>

      <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
        <p>
          Cryptopedia (Crypto通) is an educational platform providing cryptocurrency information, including prices, charts, news, and learning content for reference only.
        </p>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            No Investment Advice
          </h4>
          <p className="mb-0">
            The information provided on this site is for general informational and educational purposes only. Nothing on Cryptopedia constitutes investment advice, recommendation, solicitation, or offer to buy, sell, or hold any cryptocurrency or financial asset.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            Accuracy Not Guaranteed
          </h4>
          <p className="mb-0">
            Cryptocurrency prices, market data, and other information on this site may be delayed, incomplete, or inaccurate. All content is provided "as is" without warranties of any kind, and we do not guarantee completeness, accuracy, or timeliness.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            No Liability
          </h4>
          <p className="mb-0">
            Cryptopedia and its partners shall not be liable for any direct, indirect, incidental, consequential, or punitive losses arising from your use of, or reliance on, information provided on this site.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            User Responsibility
          </h4>
          <p className="mb-0">
            You should independently verify all information and consult with qualified financial or professional advisors before making any investment decisions. Cryptocurrency investments carry significant risk of loss.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            Jurisdiction
          </h4>
          <p className="mb-0">
            This site is operated from Hong Kong. Use of this site is subject to the laws and jurisdiction of the Hong Kong Special Administrative Region.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 leading-none">
            Changes
          </h4>
          <p className="mb-0">
            This disclaimer may be updated from time to time. Continued use of the site constitutes acceptance of any updated terms.
          </p>
        </div>
      </div>
    </div>
  )
}