# Design

## Theme

小獸所採用 restrained product UI。基底是乾淨的淡綠白與深森林綠，小面積使用蜂蜜黃與花瓣粉作提醒與可愛感。整體應像可信任的照護筆記與地圖工具，而不是行銷 landing page。

## Color

- Background: `--background`, 接近 `#f7faf4`
- Surface: `--card`, `--popover`, 白色與輕微綠調
- Ink: `--foreground`, 深森林綠
- Primary: 深森林綠，用於主要操作、目前選取與連結
- Secondary: sage 綠，用於篩選、標籤與柔和狀態
- Warm accent: honey 黃，用於低風險提醒與贊助標示
- Notice accent: petal 粉，用於公告、急診、休診或需要注意的資訊

## Typography

使用 Noto Sans TC 一套字體。產品 UI 使用固定 rem 尺度，不使用大型流動標題。標題重在清楚與掃描性，文章內文行長控制在 65 到 75 字元。

## Shape And Elevation

卡片與面板使用 12 到 16px 圓角。避免 28px 以上大型圓角。常態面板以邊框區分，陰影只用在浮層、地圖容器或互動焦點，不與重邊框一起堆疊。

## Components

以 shadcn/ui 元件作為互動基礎：Button、Badge、Select、Checkbox、Sheet、Dialog、Card、Alert、Separator、Skeleton。醫院資料可使用自訂組合，但視覺語彙需沿用同一套 token。

## Advertising

廣告版位必須明確標示「贊助資訊」。首頁放在查詢結果與最新消息之間；文章列表放在分類與文章卡之間；文章頁放在主要內容段落之後或結尾前。不可插入地圖、醫院卡片或急症提醒中。
