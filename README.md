# xjack.tw

叉傑克 XJack（許紘瑋）的個人網站：自我介紹、人生與事業的里程碑、做過的作品，以及舊站「叉傑克不跑步聊數據」搬來的文章。

- 驗收網址：https://new.xjack.tw
- 正式網址（切換後）：https://xjack.tw
- 規劃書：[docs/PLAN.md](docs/PLAN.md)

## 常改的地方

| 想做的事 | 改哪個檔 |
|---|---|
| 新增一筆里程碑 | `src/data/milestones.ts` |
| 更新「最近在忙」 | `src/data/now.ts`（記得改更新日期） |
| 新增作品 | `src/data/projects.ts` |
| 新增媒體報導、訪談、演講 | `src/data/media.ts` |
| 改自我介紹、社群連結 | `src/data/site.ts`、`src/data/about.ts` |
| 新寫一篇文章 | 在 `src/content/blog/` 放一個 `.md` |
| 重做分享預覽圖 | 改 `scripts/og/og.html` 後跑 `npm run og` |

push 到 `main` 之後，GitHub Actions 會自動建置並部署到 GitHub Pages。

## 本機開發

```bash
npm install
npm run dev
```

需要 Node.js 22.23 以上。

## 文章搬家

舊站文章用原站編號當網址：`https://xjack.tw/w/bd/1310` 會轉到 `/blog/1310/`。文章內容一字未改，圖片也一起搬過來；桐桐的真實正臉照片不放（隱私規則見 [docs/PLAN.md](docs/PLAN.md)）。
