export default function DisclaimerSection() {
    return (
      <section className="disclaimer-section py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-mintdark mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-mintdark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              免責注意事項
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">🔔</span>
                  <p className="text-gray-700">醫院營運狀況可能隨時調整，實際是否看診仍以醫院公告或電話詢問為準。</p>
                </div>
  
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">📞</span>
                  <p className="text-gray-700">為避免撲空或延誤看診，出發前請務必致電確認是否看特寵，以及是否需要預約。</p>
                </div>
  
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">ℹ️</span>
                  <p className="text-gray-700">本平台提供篩選功能僅供快速查詢參考，不代表完整醫療服務內容。</p>
                </div>
              </div>
  
              <div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="text-mint mr-2">•</span>
                    <span>部分特寵醫院採預約制，未預約可能無法看診。</span>
                  </li>
                  <li className="flex">
                    <span className="text-mint mr-2">•</span>
                    <span>有些醫院僅特定醫師或時段看診特寵，非全天候開放。</span>
                  </li>
                  <li className="flex">
                    <span className="text-mint mr-2">•</span>
                    <span>資料僅供參考用途，非代表推薦、醫療建議，亦不代表推薦特定醫院。</span>
                  </li>
                  <li className="flex">
                    <span className="text-mint mr-2">•</span>
                    <span>資料由人工一間一間上網找資料整理，若有錯漏，敬請見諒，出發前請再次致電醫院確認。</span>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="mt-6 p-4 bg-cream rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-yellow-800">
                  <span className="font-medium">重要提醒：</span>
                  本平台資訊僅供參考，實際診療服務、營業時間及收費標準請以各醫院公告為準。若遇寵物緊急狀況，請立即聯繫最近的動物醫院或24小時急診醫院。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  