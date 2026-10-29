# xjack.tw 個人網站：規劃書

> 2026-10-27 建立。XJack 交代：「現在的 xjack.tw 建在 RQ 官網系統上，已經不需要了。全面規劃完整的個人網站，是個人的；把所有值得記錄的事情、成就、里程碑都保存下來。先放子網域，確認沒問題再換掉。」

## 1. 這個網站要做到什麼

| 目標 | 怎麼算達成 |
|---|---|
| 一個網址講清楚「叉傑克是誰」 | 首頁 10 秒內看得到：名字、身分、一句信念、照片、最近在忙什麼 |
| 把人生與事業的里程碑存下來 | 里程碑頁有日期、有出處，能依類別篩選；之後新增一筆只要改一個檔 |
| 舊站內容不流失 | 舊站 xjack.tw 和各個舊部落格的文章全部搬來，保留當年的文字與語氣（部分照片與連結因隱私和搬家調整過）；舊網址 `/w/bd/{編號}` 自動轉到新網址 |
| 跟 RQ 官網脫鉤 | 獨立 repo、GitHub Pages 免費託管、不依賴 RQ 的伺服器與資料庫 |
| 長輩也看得清楚 | 淺底深字、內文 18px、文字對比 ≥ 7:1、手機好讀 |

**不做的事**：不做留言系統、不做會員、不放購物或金流、不放 RQ 產品功能介紹（那是 RQ 官網的事）。

**做壞了的樣子**：看起來像 RQ 的子網站或業配頁；把 XJack 包裝成「愛跑步的人」（他不要這個形象）；出現桐桐的真實正臉、學校、住家位置。

## 2. 網站地圖

| 網址 | 內容 |
|---|---|
| `/` | 首頁：自我介紹＋照片、「一年一圈」分段圖、最近在忙、粉專精選貼文、精選作品、最新文章、聯絡方式 |
| `/about/` | 關於我：完整故事、相信的事、經歷、英文簡介、聯絡方式 |
| `/timeline/` | 里程碑：依年份由新到舊，可依類別（創業、學業、跑步、家庭、投資、創作、媒體與演講、人生）篩選 |
| `/projects/` | 作品：RQ 跑力、跟岳母的十年之約、桐桐貓貓島、桐爸日記與 LINE 貼圖、舊部落格… |
| `/blog/`、`/blog/{編號}/` | 文章：舊站搬來的文章 |
| `/rss.xml`、`/sitemap-index.xml` | 訂閱與搜尋引擎 |
| `/w/bd/{編號}`、`/web/xjack/*` | 舊站網址的轉址頁 |

## 3. 視覺設計：冒險者檔案（2026-10-27 XJack 選定）

XJack 的個性是樂觀、風趣、愛出去闖、二十年魔獸世界玩家，第一版太正式被退。整站改成一份遊戲角色檔案：

| 頁面 | 遊戲說法 | 內容 |
|---|---|---|
| 首頁 | 角色卡 | 頭像＋Lv.40+、稱號「桐爸」、職業、自評屬性、RQ 經驗值條、任務日誌、世界頻道（粉專標題外掛＋精選三篇）、裝備欄 |
| `/about/` | 角色檔案 | 基本資料（本名只在這頁）、主線劇情四章、信條、學歷與研究、媒體、有事密我 |
| `/timeline/` | 成就 | 每筆里程碑是一個成就，一般 10 點、傳說級 50 點，可依分類篩選 |
| `/projects/` | 裝備 | 作品用魔獸物品品質分級：傳說（橘）、史詩（紫）、稀有（藍） |
| `/blog/` | 冒險日誌 | 52 篇舊文章 |

- **顏色**：白底、淡灰藍分區 `#F3F6FA`、內文 `#14263F`、海軍藍 `#1E3A5F`、次要文字 `#3B4D63`；活力橘 `#FF6B35` 剛好是魔獸的傳說品質色，用來標重要時刻，只當圖形或配深字的底色。品質標籤用淡底＋同色系深字，對比都 ≥ 7:1。不用 RQ 綠。
- **字體**：標題用思源黑體 900（有精神）、內文思源黑體、數字與等級用 Barlow Condensed（像遊戲 HUD）。
- **外框**：重要卡片用 2px 海軍藍框＋實心位移陰影，像遊戲介面；一般清單只用細框。
- **標誌**：「分段 X」（C1 上升分段，XJack 選定）。從 2021 年的 XJ LOGO-05 延伸：一筆完整的粗筆，另一筆從左下往右上切成四段、一段比一段粗，像越跑越強的長條圖，最高那段是傳說橘。檔案：`public/logo.svg`、`src/components/Mark.astro`。
- **文案語氣**：第一人稱、口語、會自嘲；遊戲梗只用在標題與標籤，內容一律寫真的發生過的事。

## 4. 內容來源與查證

| 來源 | 用在哪 |
|---|---|
| 舊站 xjack.tw 全部文章（5 篇）與「我是誰」頁 | 文章、關於我 |
| Blogger「叉傑克-進化科學跑者之路」（33 篇）、Medium（不重複 9 篇）、運動筆記（不重複 5 篇） | 文章（共 52 篇，重複的留最早原文）、里程碑 |
| 粉專簡介（Graph API）、粉專全期貼文 `posts-all.json` | 自我介紹、里程碑、互動最高的貼文 |
| 個人臉書 facebook.com/HungWeiXJackHsu（2022–2025 的家庭事主要發在這） | 里程碑。公開的貼文才放連結；只給朋友看的不放連結，出處寫在 `milestones.ts` 註解 |
| 粉專知識庫的品牌文件與 Claude 長期記憶 | 里程碑、故事、隱私規則 |
| 公開網路足跡（Medium、媒體報導、Podcast、論文） | 里程碑、媒體與演講 |

每一筆里程碑都要有出處；查不到原始來源的不寫成事實。

## 5. 隱私規則（照 repo 既有規則）

- 桐桐：不放真實正臉照片（漫畫、插畫、設計圖可以），不寫學校、社區、住家位置。
- 家人稱呼：太太寫「桐媽」、岳母只寫「岳母」；不用「娶／嫁」，只說「結婚」。
- 不放 email 與電話，聯絡一律走粉專私訊。
- 不放任何個人帳戶金額；十年之約只放已公開的規則（各 100 萬、比報酬率）。

## 6. 技術與部署

- **Astro 7**（靜態網站產生器）：文章是 Markdown、里程碑與作品是 TypeScript 資料檔，建置成純 HTML。
- **GitHub Pages**：repo `xjack913/xjack.tw`，push 到 `main` 由 GitHub Actions 自動建置、部署。
- **網域**：Cloudflare 管 xjack.tw 的 DNS。
  1. 驗收期：`new.xjack.tw` CNAME → `xjack913.github.io`（只走 DNS、不代理，跟 bet、tong 一樣）。
  2. 正式切換（XJack 驗收後）：見第 7 節。

## 7. 正式切換步驟（驗收通過後才做）

> 2026-10-29 依上線評估改寫。舊版的順序會讓驗收站太早開放收錄，`public/CNAME` 也不會生效，還少了退回方法。

**為什麼 DNS 用灰雲（只走 DNS、不代理）**：GitHub 要先確認網域真的指到 GitHub Pages，才會替網站申請 HTTPS 憑證。開橘雲時查到的是 Cloudflare 的位址，檢查不會過，憑證發不下來。橘雲保護的是自己的主機（藏住位址、擋攻擊），RQ 舊站有 AWS 主機所以需要；新站是 GitHub 託管的靜態網頁，沒有主機、資料庫、登入可以被打，GitHub Pages 本身就放在 CDN 上。bet、tong 也是灰雲。

### 事前

- [x] 在 GitHub 帳號驗證 xjack.tw 網域（2026-10-29，Cloudflare 上的 `_github-pages-challenge-xjack913` TXT 紀錄，不要刪）：別的 GitHub 帳號不能拿 xjack.tw 和它的子網域架站。
- [x] 匯出 Cloudflare DNS 備份（2026-10-29，`xjack.tw.txt`，在 XJack 電腦的下載資料夾）。裡面有 RQ 主機位址，所以不進 repo；退回時照它改。
- 挑晚上人少的時候做：憑證最久要等 1 小時，這段時間 https://xjack.tw 可能出現憑證警告。

### 切換當天

1. **Cloudflare 改兩筆 DNS**：
   - `xjack.tw`：現在是 CNAME 指向 RQ 的 AWS 負載平衡器、橘雲。直接編輯這筆，目標改成 `xjack913.github.io`、改成灰雲。Cloudflare 會把主網域的 CNAME 攤平成 A／AAAA 回應，效果跟四筆 A 紀錄一樣，而且一次改完、不用先刪再加。
   - `www`：現在是 CNAME 指向 `xjack.tw`、橘雲。目標改成 `xjack913.github.io`、改成灰雲。GitHub 會自動把 www 轉到 xjack.tw。
   - 如果第 2 步的 DNS 檢查一直不過，改用 GitHub 文件寫的設法：刪掉主網域那筆 CNAME，加四筆 A（`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`）和四筆 AAAA（`2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153`），全部灰雲。
2. **GitHub Pages 自訂網域改成 `xjack.tw`**（repo Settings → Pages），按 Save，DNS 檢查通過後 GitHub 開始申請憑證。第 1、2 步要接著做，中間 xjack.tw 會短暫顯示 GitHub 的 404。
   - 一個 Pages 網站只能有一個網域，按下 Save 的同時 `new.xjack.tw` 就失效了。
3. **設 Actions 變數 `SITE_URL` = `https://xjack.tw`**（repo Settings → Secrets and variables → Actions → Variables），再到 Actions 手動跑一次「部署到 GitHub Pages」（Run workflow）。這版開始 canonical、sitemap、RSS 都用 xjack.tw，`robots.txt` 和每頁的 `noindex` 也改成開放收錄。
   - 一定要在第 1、2 步之後才設。太早設，還在驗收的 new.xjack.tw 會開放收錄，又宣稱正本在當時還是 RQ 舊站的 xjack.tw。
   - `public/CNAME` 不用改：部署走 GitHub Actions，GitHub 不看這個檔，網域只看 Pages 設定。

### 憑證發好之後（通常幾分鐘，最久 1 小時）

4. Pages 設定頁勾「Enforce HTTPS」。
5. 逐項檢查：
   - https://xjack.tw 和 https://www.xjack.tw 都打得開、沒有憑證警告；www 和 http:// 都會轉到 https://xjack.tw。
   - 首頁原始碼沒有 `noindex`，`canonical` 是 `https://xjack.tw/`；https://xjack.tw/robots.txt 允許收錄，sitemap 指向 xjack.tw。
   - 舊網址會轉：例如 https://xjack.tw/w/bd/1277 轉到搬過來的文章。
   - 用臉書的分享偵錯工具貼一篇文章網址，縮圖和標題正常。
   - GA4「即時」看得到自己的瀏覽。
   - bet.xjack.tw、tong.xjack.tw 照常。
6. 刪掉 Cloudflare 的 `new.xjack.tw` 紀錄。驗收站整站不收錄，不用轉址；網域已驗證，刪了也不會被別人拿去用。
7. Google Search Console 加入 xjack.tw（網域資源，用 DNS TXT 驗證），提交 `https://xjack.tw/sitemap-index.xml`。

### 2～4 週都沒問題之後

8. 通知 RQ 那邊：xjack.tw 不再由 RQ 官網系統服務，RQ 端的 xjack 網站設定可以停用（屬於 RQ 專案，不在這個 repo 處理）。RQ 停用之前都還能退回舊站，所以不要切換完馬上講。

### 出問題時怎麼退回

1. Cloudflare：`xjack.tw` 和 `www` 照 `xjack.tw.txt` 改回原本的目標，改回橘雲（主網域如果已經改成 A／AAAA，先刪掉再加回 CNAME）。
2. 要繼續驗收的話：Cloudflare 加回 `new.xjack.tw` CNAME → `xjack913.github.io`（灰雲），Pages 自訂網域改回 `new.xjack.tw`。
3. 刪掉 Actions 變數 `SITE_URL`，手動重跑部署，網站回到不收錄的驗收狀態。

## 8. 之後怎麼維護

- 新增里程碑：改 `src/data/milestones.ts`，加一筆、push。
- 更新「最近在忙」：改 `src/data/now.ts`，順便改更新日期。
- 新增作品：改 `src/data/projects.ts`。
- 新寫文章：在 `src/content/blog/` 放一個 `.md`（frontmatter 要有 `title`、`date`、`slug`）。
- 首頁「世界頻道」（XJack 2026-10-27 定）：
  - 標題列是網站自己做的：大頭貼、叉傑克 XJack、追蹤粉專按鈕（`src/components/FbPage.astro`）。臉書官方粉專外掛不用：貼文串沒登入看不到（2026-10-27 實測），標題模式也跑版，封面載不出來、追蹤人數被按鈕列壓住（2026-10-28 試 6 種參數都一樣）。
  - 下面三張卡片是精選貼文，挑有代表性、最吸引人、風格和領域都不同的三篇，不是最新三篇；桐桐有真實照片的不選。要換篇就改 `scripts/sync-fb-featured.mjs` 的 `PICKS`，在本機跑 `FB_PAGE_TOKEN=... node scripts/sync-fb-featured.mjs`（或給 `FB_USER_TOKEN`），再 commit `src/data/fb-featured.json` 和 `public/fb-featured/`。
  - 不用每天自動更新。部署流程也會跑這支，但 repo 沒設 Secret `FB_PAGE_TOKEN` 就直接沿用快照。
