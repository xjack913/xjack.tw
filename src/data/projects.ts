// 作品：自己做出來、別人點得到的東西。首頁取 featured，作品頁全部列出。

export interface Project {
  id: string;
  name: string;
  period: string;
  status: '進行中' | '已完成' | '連載中';
  summary: string;
  body?: string;
  url?: string;
  urlLabel?: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'rq',
    name: 'RQ 跑力',
    period: '2016 —',
    status: '進行中',
    summary: '幫跑者把手錶數據變成看得懂的訓練建議：跑力、課表、訓練負荷，一路做了十年。',
    body: '十年前，我只是想幫一位叫徐國峰的鐵人隊教練，寫個程式算跑力。沒想到這功能寫成了一家公司。',
    url: 'https://www.runningquotient.com/',
    urlLabel: '前往 RQ 跑力',
    featured: true,
  },
  {
    id: 'ten-year-bet',
    name: '跟岳母的十年之約',
    period: '2026 —',
    status: '進行中',
    summary: '波段操作派的岳母對上大盤市值仔的我，各拿 100 萬，每半年結算一局，公開比十年。',
    url: 'https://bet.xjack.tw/',
    urlLabel: '看目前比數',
    image: '/images/projects/ten-year-bet.jpg',
    imageAlt: '十年之約網站畫面：岳母與叉傑克的對戰卡和比數板',
    featured: true,
  },
  {
    id: 'tong-cat-island',
    name: '桐桐貓貓島',
    period: '2026',
    status: '進行中',
    summary: '桐桐自己畫設計圖、我把它做成可以玩的 3D 貓貓島：50 隻貓跳高、表演、寫日記，還有附注音的數學課。',
    url: 'https://tong.xjack.tw/',
    urlLabel: '上島玩玩看',
    image: '/images/projects/tong-cat-island.jpg',
    imageAlt: '桐桐貓貓島：桐桐用鉛筆畫的貓貓島設計圖',
    featured: true,
  },
  {
    id: 'tongba-diary',
    name: '桐爸日記',
    period: '2025 —',
    status: '連載中',
    summary: '把桐桐每天冒出來的金句和家裡的小事畫成多格漫畫，每週一、四在粉絲專頁連載。',
    url: 'https://www.facebook.com/rqxjack',
    urlLabel: '到粉絲專頁看漫畫',
  },
  {
    id: 'line-stickers',
    name: '桐爸日記 LINE 貼圖',
    period: '2026',
    status: '已完成',
    summary: '把桐爸日記的角色做成 40 張一組的 LINE 貼圖，第一組「萬用日常大字」已經上架。',
    url: 'https://store.line.me/stickershop/product/37327326/zh-Hant',
    urlLabel: '到 LINE 貼圖小舖',
  },
  {
    id: 'blog',
    name: '十年的部落格',
    period: '2014 — 2023',
    status: '已完成',
    summary:
      'Blogger「叉傑克-進化科學跑者之路」、Medium 與舊站「叉傑克不跑步聊數據」、運動筆記，寫訓練日誌、比賽心得、馬拉松數據分析和創業。52 篇全部搬到這個網站的「文章」。',
    url: '/blog/',
    urlLabel: '讀舊文章',
  },
];
