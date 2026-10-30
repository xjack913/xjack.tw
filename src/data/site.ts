// 全站共用的身分與連結。改這裡，頁首、頁尾、關於、結構化資料會一起更新。

export const person = {
  name: '叉傑克',
  nameEn: 'XJack',
  realName: '許紘瑋',
  realNameEn: 'Hung-Wei Hsu',
  // 粉專簡介原文（XJack 自己寫的）；「臺科大資工博士生」2026-06-20 休學後拿掉。分享預覽、搜尋結果用這句
  intro: '工程師出身的 RQ 創辦人、桐桐爸爸、遊戲玩家，也是跑步科學訓練的推廣者。',
  // 首頁在搜尋結果的標題：「叉傑克 XJack｜RQ 跑力創辦人、桐爸」
  tagline: 'RQ 跑力創辦人、桐爸',
  // 結構化資料的 knowsAbout：讓搜尋引擎和 AI 知道可以拿哪些主題來問他
  knowsAbout: ['跑步科學化訓練', '跑力', '馬拉松訓練', '運動數據分析', '軟體開發', '新創經營'],
  motto: '我相信生命的每一秒都有意義。',
  // 個人品牌的底層信念：跑步訓練和指數投資都是「時間 × 複利 × 紀律」
  belief: '最好 20 年前開始；第二好的開始時間，就是現在。',
  roles: ['RQ 跑力共同創辦人暨執行長', '跑步科學化訓練推廣者', '桐桐的爸爸', '大盤市值仔', '魔獸世界老玩家'],

  // ── 冒險者檔案（首頁角色卡）──
  // 稱號：XJack 2026-10-27 指定「桐爸」（舊粉專名別再用）；職業就不再重複列桐爸
  title: '桐爸',
  // 公開說過「年過四十的阿宅」「40 歲還想做遊戲的工程師」
  level: 'Lv.40+',
  classes: [
    { kind: '主職', name: '創業者' },
    { kind: '興趣', name: '幫助跑者' },
    { kind: '本命', name: '魔獸玩家' },
  ],
  // 首頁自我介紹（口語版）
  hello:
    '工程師出身的 RQ 跑力創辦人、桐桐的爸爸、二十年資歷的魔獸世界玩家。當年只是想幫國峰寫個程式算跑力，沒想到寫成一家公司；現在白天帶團隊打王，晚上回艾澤拉斯打 M+。',
  // 自評屬性：純屬好玩，數字是自己給的
  stats: [
    { name: '寫程式', value: 95, note: '從東華 GAMELab 一路寫到現在' },
    { name: '打電動', value: 99, note: '二十年前就在艾澤拉斯開團' },
    { name: '跑步', value: 62, note: '半馬最佳 1:53，還在練' },
    { name: '當爸爸', value: 88, note: '最終分數由桐桐決定' },
    { name: '理財', value: 80, note: '買了就不動的大盤市值仔' },
  ],
};

export const links = {
  facebook: { label: 'Facebook 粉絲專頁', url: 'https://www.facebook.com/rqxjack' },
  instagram: { label: 'Instagram', url: 'https://www.instagram.com/rqxjack/' },
  youtube: { label: 'YouTube', url: 'https://www.youtube.com/@rqxjack' },
  medium: { label: 'Medium', url: 'https://medium.com/@xjackhsu' },
  linkedin: {
    label: 'LinkedIn',
    url: 'https://tw.linkedin.com/in/%E7%B4%98%E7%91%8B-%E8%A8%B1-2a075451',
  },
  github: { label: 'GitHub', url: 'https://github.com/xjack913' },
  rq: { label: 'RQ 跑力', url: 'https://www.runningquotient.com/' },
};

// GA4：XJack 個人 Google 帳號下獨立的「叉傑克 XJack 個人網站」資源（2026-10-29 建，跟貓貓島分開）
export const analyticsId = 'G-5XDRZB704V';

// 各頁在搜尋結果的描述；llms.txt 也用同一句
export const pageDescriptions = {
  timeline: '叉傑克 XJack 從東華新手村、創立 RQ 跑力、當上桐爸到今天解鎖的每一個成就。',
  projects: '叉傑克 XJack 做出來的東西：RQ 跑力、跟岳母的十年之約、桐桐貓貓島、桐爸日記與更多。',
  blog: '叉傑克 XJack 十年來寫的訓練日誌、比賽心得、馬拉松數據分析、創業、育兒與投資文章。',
};

// 選單：遊戲角色檔案的說法，第一次來的人也看得懂
export const nav = [
  { href: '/about/', label: '角色檔案' },
  { href: '/timeline/', label: '成就' },
  { href: '/projects/', label: '裝備' },
  { href: '/blog/', label: '冒險日誌' },
];
