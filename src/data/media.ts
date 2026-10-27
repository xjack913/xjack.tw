// 媒體報導、訪談、Podcast、演講。只收查得到原始來源的（2026-10-27 查證）。

export interface MediaItem {
  date: string;
  kind: '報導' | '專訪' | 'Podcast' | '演講' | '影片';
  title: string;
  outlet?: string;
  url?: string;
}

export const media: MediaItem[] = [
  {
    date: '2025-09-09',
    kind: 'Podcast',
    title: 'ep.261〈跑兩百公尺就能算出全馬成績？ ft. 叉傑克〉',
    outlet: '跑步不要聽',
    url: 'https://podcasts.apple.com/tw/podcast/id1530709615?i=1000725802243',
  },
  {
    date: '2025-07-16',
    kind: '影片',
    title: '如何用 RQ 讓馬拉松訓練更科學、更有效率？（演講精華）',
    outlet: 'RQ 跑力 YouTube',
    url: 'https://youtu.be/Tp3UF9AALSU',
  },
  {
    date: '2025-04-26',
    kind: '演講',
    title: '如何用 RQ 進行馬拉松科學化訓練',
    outlet: '台北市長跑協會',
    url: 'https://www.runningquotient.com/article/single/291',
  },
  {
    date: '2025-02-17',
    kind: '報導',
    title: '科技缺工！3 因素「少子化、就業意向變、大廠挖角」',
    outlet: 'TVBS 新聞',
    url: 'https://news.tvbs.com.tw/life/2781744',
  },
  {
    date: '2024-12-31',
    kind: '專訪',
    title: '當自己公司的替代役是甚麼體驗？役男、老闆都是我',
    outlet: '1111 人力銀行科技島',
    url: 'https://www.1111.com.tw/news/jobns/159050',
  },
  {
    date: '2024-11-20',
    kind: '專訪',
    title: '雲端數據加乘 RQ 跑力，財務與決策全面加速',
    outlet: '藍途記帳客戶故事',
    url: 'https://blog.nextrek.co/user-sharing_app_runningquotient/',
  },
  {
    date: '2023-12-29',
    kind: '演講',
    title: '介紹 RQ 課表與訓練計畫系統：教練線上說明會',
    outlet: 'RQ 跑力',
    url: 'https://www.runningquotient.com/video/t?id=1211',
  },
  {
    date: '2023-05-15',
    kind: '演講',
    title: '跑步教練聚會：線上訓練營實戰經驗分享（與徐國峰、羅譽寅）',
    outlet: 'RQ 跑力',
    url: 'https://www.runningquotient.com/video/t?id=975',
  },
  {
    date: '2023-03-30',
    kind: 'Podcast',
    title: '#116〈Running Quotient RQ CEO - XJack aka 許紘瑋〉',
    outlet: 'TriYang',
    url: 'https://open.firstory.me/story/clfucxzz001y201uq48p7hp2z',
  },
  {
    date: '2023-01-02',
    kind: '專訪',
    title: 'RQ 跑力品牌形象重塑 演算法新功能再創跑者高峰',
    outlet: '動一動 don1don',
    url: 'https://www.don1don.com/archives/206098',
  },
  {
    date: '2021-12-13',
    kind: 'Podcast',
    title: '#31〈RQ 執行長許紘瑋：不想變快；不想變強，也由不得你！〉',
    outlet: '大黑看天下',
    url: 'https://open.firstory.me/story/ckx4ae34l518i09050wa68p83',
  },
  {
    date: '2019-04-10',
    kind: '演講',
    title: 'RQ 跑步科學化訓練入門（新竹場）',
    outlet: '新竹市立體育館',
    url: 'https://www.runningquotient.com/video/t?id=171',
  },
  {
    date: '2017-09-01',
    kind: '演講',
    title: '關鍵跑步數據大解密 No.5（花蓮場）',
    outlet: 'RQ 跑力',
    url: 'https://runningquotient.kktix.cc/events/rqkey0901',
  },
  {
    date: '2017-01-04',
    kind: '專訪',
    title: '土法煉鋼堆跑量？破 PB 關鍵從心率訓練開始！',
    outlet: '運動筆記',
    url: 'https://running.biji.co/index.php?q=news&act=info&id=95183',
  },
  {
    date: '2016-10-18',
    kind: '報導',
    title: 'Garmin 全馬 PB 班：挑戰進步的三大要素',
    outlet: '動一動 don1don',
    url: 'https://www.don1don.com/archives/83379',
  },
  {
    date: '2016-06-07',
    kind: '報導',
    title: 'AppWorks Demo Day #12 精選團隊',
    outlet: 'TechOrange 科技報橘',
    url: 'https://techorange.com/2016/06/07/appworks-demoday12-10group-introduce/',
  },
  {
    date: '2014-03-26',
    kind: '報導',
    title: '東華大學資工系開發東馬運動計時資訊系統',
    outlet: '國立東華大學',
    url: 'https://secret.ndhu.edu.tw/p/406-1011-150026,r3577.php?Lang=zh-tw',
  },
  {
    date: '2012-03-02',
    kind: '專訪',
    title: '有話網講 004〈打怪玩 Game 出頭天？〉',
    outlet: '公視《有話好說》',
    url: 'https://www.youtube.com/watch?v=A0zd3Ivd_V8',
  },
  {
    date: '2010-10-15',
    kind: '報導',
    title: '東華 Online 線上冒險兼學習',
    outlet: 'Yahoo 新聞',
    url: 'https://tw.news.yahoo.com/%E6%9D%B1%E8%8F%AFonline-%E7%B7%9A%E4%B8%8A%E5%86%92%E9%9A%AA%E5%85%BC%E5%AD%B8%E7%BF%92.html',
  },
];
