// 全站共用的身分與連結。改這裡，頁首、頁尾、關於、結構化資料會一起更新。

export const person = {
  name: '叉傑克',
  nameEn: 'XJack',
  realName: '許紘瑋',
  realNameEn: 'Hung-Wei Hsu',
  // 粉專簡介原文（XJack 自己寫的）；「臺科大資工博士生」2026-06-20 休學後拿掉
  intro: '工程師出身的 RQ 創辦人、桐桐爸爸、遊戲玩家，也是跑步科學訓練的推廣者。',
  motto: '我相信生命的每一秒都有意義。',
  // 個人品牌的底層信念：跑步訓練和指數投資都是「時間 × 複利 × 紀律」
  belief: '最好 20 年前開始；第二好的開始時間，就是現在。',
  roles: ['RQ 跑力共同創辦人暨執行長', '跑步科學化訓練推廣者', '桐桐的爸爸', '大盤市值仔', '遊戲玩家'],
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

export const nav = [
  { href: '/about/', label: '關於我' },
  { href: '/timeline/', label: '里程碑' },
  { href: '/projects/', label: '作品' },
  { href: '/blog/', label: '文章' },
];
