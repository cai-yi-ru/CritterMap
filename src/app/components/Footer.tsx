export default function Footer() {
    return (
        <footer className="footer mt-16 w-full bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="md:col-span-1">
                        <div className="flex justify-center items-center mb-4">
                            <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center text-white text-xl">🐹</div>
                            <span className="logo-text ml-2">小獸所</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            小獸所特寵醫院地圖查詢平台致力於幫助特殊寵物主人尋找合適的獸醫資源，提供全台灣最完整的特寵醫療資訊。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-mintdark mb-4">快速連結</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/">首頁</a></li>
                            <li><a href="/blog">部落格</a></li>
                            <li><a href="/about">關於我們</a></li>
                            <li><a href="/contact">聯絡我們</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-mintdark mb-4">部落格分類</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/blog/mouse">鼠類飼養</a></li>
                            <li><a href="/blog/rabbit">兔兔照護</a></li>
                            <li><a href="/blog/bird">鳥類照顧</a></li>
                            <li><a href="/blog/reptile">爬蟲相關</a></li>
                            <li><a href="/blog/other">其他特寵</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-mintdark mb-4">聯絡我們</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>📧 info@xiaoshou.com</li>
                            <li>📞 02-1234-5678</li>
                            <li>📍 台北市信義區松仁路100號</li>
                        </ul>
                        <div className="mt-4 flex justify-center space-x-4 text-gray-500">
                            <a href="#" aria-label="Facebook" className="hover:text-mint">📘</a>
                            <a href="#" aria-label="Instagram" className="hover:text-mint">📸</a>
                            <a href="#" aria-label="Twitter" className="hover:text-mint">🐦</a>
                            <a href="#" aria-label="YouTube" className="hover:text-mint">📺</a>
                        </div>
                    </div>
                </div> */}

                {/* 版權資訊 */}
                {/* <div className="border-t border-gray-200 mt-8 pt-8"> */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2025 小獸所. 版權所有.
                    </p>
                </div>
                {/* <div className="text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">
                            © 2025 小獸所. 版權所有.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <ul className="flex space-x-6">
                                <li><a href="/privacy" className="text-sm text-gray-500 hover:text-mint">隱私政策</a></li>
                                <li><a href="/terms" className="text-sm text-gray-500 hover:text-mint">使用條款</a></li>
                                <li><a href="/sitemap" className="text-sm text-gray-500 hover:text-mint">網站地圖</a></li>
                            </ul>
                        </div>
                    </div>
                </div> */}
            </div>
        </footer>
    );
}