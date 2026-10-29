// 裝備欄（作品）：自己做出來、別人點得到的東西。首頁取 featured，裝備頁全部列出。
// quality 借魔獸世界的物品品質：legendary 傳說（橘）、epic 史詩（紫）、rare 稀有（藍）。
// flavor 是物品說明底下那行小字，放一句好玩的話。

export type Quality = 'legendary' | 'epic' | 'rare';

export const qualityLabel: Record<Quality, string> = {
  legendary: '傳說',
  epic: '史詩',
  rare: '稀有',
};

export interface Project {
  id: string;
  name: string;
  period: string;
  status: '進行中' | '已完成' | '連載中';
  quality: Quality;
  summary: string;
  flavor?: string;
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
    quality: 'legendary',
    summary: '幫跑者把手錶數據翻譯成看得懂的訓練：跑力、課表、訓練負荷，十幾萬跑者用過。現在還有「徐國峰 × AI」AI 教練陪你練。',
    flavor: '當年只是想幫國峰寫個程式算跑力，沒想到寫成一家公司。',
    url: 'https://www.runningquotient.com/',
    urlLabel: '前往 RQ 跑力',
    // 預覽圖：自己做的圖卡，LOGO 是 2022 品牌重塑的「中文標準標誌組合_彩色版1」（雲端 2022品牌重塑／VI最終版本檔案／VI-1212_最終版本／png，裁掉留白），時間軸五件事都出自 milestones.ts（官網首頁是素材照片配註冊鈕，像廣告所以不用）
    image: '/images/projects/rq.jpg',
    imageAlt: 'RQ 跑力圖卡：2013 跑力計算器上線、2016 共同創立、2019 第二代即時跑力、2023 註冊破 10 萬、2026 十週年',
    featured: true,
  },
  {
    id: 'ten-year-bet',
    name: '跟岳母的十年之約',
    period: '2026 —',
    status: '進行中',
    quality: 'epic',
    summary: '波段操作派的岳母對上大盤市值仔的我，各拿 100 萬，每半年結算一局，公開比十年。網站每個交易日自動更新淨值。',
    flavor: '錢交給市場，時間留給真正重要的事。',
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
    quality: 'epic',
    summary: '桐桐自己畫設計圖、我把它做成可以玩的 3D 貓貓島：50 隻貓跳高、表演、寫日記，還有附注音的數學課。',
    flavor: '島主：桐桐。工程師：爸爸。',
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
    quality: 'rare',
    summary: '把桐桐每天冒出來的金句和家裡的小事畫成多格漫畫，每週一、四在粉絲專頁連載。',
    flavor: '素材由桐桐無償提供，爸爸負責被吐槽。',
    url: 'https://www.facebook.com/rqxjack',
    urlLabel: '到粉絲專頁看漫畫',
    // 預覽圖：雲端「桐爸日記漫畫」典藏裡三篇已發表的（260301、260303、260312）
    image: '/images/projects/tongba-diary.jpg',
    imageAlt: '三篇桐爸日記漫畫：〈升級只差 2396 步〉、〈桐桐的人生優先順序〉、〈男子廁所守護神〉',
  },
  {
    id: 'line-stickers',
    name: '桐爸日記 LINE 貼圖',
    period: '2026',
    status: '已完成',
    quality: 'rare',
    summary: '把桐爸日記的角色做成 40 張一組的 LINE 貼圖，第一組「萬用日常大字」已經上架。',
    url: 'https://store.line.me/stickershop/product/37327326/zh-Hant',
    urlLabel: '到 LINE 貼圖小舖',
    // 預覽圖：已上架的 A 版（RQ 款）挑 6 張
    image: '/images/projects/line-stickers.jpg',
    imageAlt: '桐爸日記 LINE 貼圖六張：讚啦！、哈哈哈、我錯了、你說呢？、加油！、掰掰',
  },
  {
    id: 'blog',
    name: '十年的部落格',
    period: '2014 — 2023',
    status: '已完成',
    quality: 'rare',
    summary:
      'Blogger「叉傑克-進化科學跑者之路」、Medium、舊站 xjack.tw 和運動筆記，寫訓練日誌、比賽心得、馬拉松數據和創業。52 篇全部搬進「冒險日誌」。',
    flavor: '從肥宅到跑完全馬的完整攻略。',
    url: '/blog/',
    urlLabel: '讀冒險日誌',
    // 預覽圖：六篇不同年份舊文章的封面（2014 都蘭、2015 開網誌、2017 初馬、2018 功率計、2020 臺北馬數據、2022 RQ 六歲），沒有桐桐的照片
    image: '/images/projects/blog.jpg',
    imageAlt: '六篇舊文章的封面：2014 都蘭初半馬、2015 鍵盤上的小貓、2017 初馬完賽、2018 跑步功率計、2020 臺北馬數據圖、2022 RQ 團隊合照',
  },
];
