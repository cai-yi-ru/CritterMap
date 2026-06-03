export default function DisclaimerSection() {
    return (
      <section className="mt-10 bg-honey-100/70 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-honey-200 bg-white/82 p-6 shadow-soft md:p-8">
            <h2 className="mb-6 flex items-center text-xl font-extrabold text-forest-900">
              <span className="mr-2">!</span>
              免責注意事項
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">🔔</span>
                  <p className="text-stone-700">醫院營運狀況可能隨時調整，實際是否看診仍以醫院公告或電話詢問為準。</p>
                </div>
  
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">📞</span>
                  <p className="text-stone-700">為避免撲空或延誤看診，出發前請務必致電確認是否看特寵，以及是否需要預約。</p>
                </div>
  
                <div className="disclaimer-item">
                  <span className="disclaimer-icon">ℹ️</span>
                  <p className="text-stone-700">本平台提供篩選功能僅供快速查詢參考，不代表完整醫療服務內容。</p>
                </div>
              </div>
  
              <div>
                <ul className="space-y-3 text-stone-700">
                  <li className="flex">
                    <span className="text-sage-600 mr-2">•</span>
                    <span>部分特寵醫院採預約制，未預約可能無法看診。</span>
                  </li>
                  <li className="flex">
                    <span className="text-sage-600 mr-2">•</span>
                    <span>有些醫院僅特定醫師或時段看診特寵，非全天候開放。</span>
                  </li>
                  <li className="flex">
                    <span className="text-sage-600 mr-2">•</span>
                    <span>資料僅供參考用途，非代表推薦、醫療建議，亦不代表推薦特定醫院。</span>
                  </li>
                  <li className="flex">
                    <span className="text-sage-600 mr-2">•</span>
                    <span>資料由人工一間一間上網找資料整理，若有錯漏，敬請見諒，出發前請再次致電醫院確認。</span>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="mt-6 rounded-3xl border border-honey-200 bg-honey-100 p-4">
              <div className="flex items-start">
                <span className="mr-2 mt-0.5 flex-shrink-0 text-clay-700">△</span>
                <p className="text-clay-700">
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
  
