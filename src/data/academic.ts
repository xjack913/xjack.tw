// 學歷、論文與專利（2026-10-27 查證：東華資工系網、戴文凱教授著作頁、Crossref、臺灣博碩士論文系統）。

export const education = [
  { years: '2003 — 2007', school: '國立東華大學 資訊工程學系', degree: '學士' },
  { years: '2007 — 2009', school: '國立東華大學 資訊工程學系 GAMELab（指導教授戴文凱）', degree: '碩士' },
  { years: '2009 — 2014', school: '國立東華大學 資訊工程學系', degree: '博士班，休學創業' },
  { years: '2025 — 2026', school: '國立臺灣科技大學 資訊工程系', degree: '博士班，休學' },
];

export interface Publication {
  year: string;
  title: string;
  venue: string;
  authors: string;
  url?: string;
}

export const publications: Publication[] = [
  {
    year: '2013',
    title: 'A Data-Driven Path Synthesis Framework for Racing Games',
    venue: 'ICIG 2013（IEEE）',
    authors: 'Charlie Irawan Tan, Hung-Wei Hsu, Wen-Kai Tai, Chin-Chen Chang, Der-Lor Way',
    url: 'https://doi.org/10.1109/icig.2013.138',
  },
  {
    year: '2012',
    title: 'An Automatic Race Track Generating System',
    venue: 'ACE 2012（Springer LNCS）',
    authors: 'Tai-Yun Chen, Hung-Wei Hsu, Wen-Kai Tai, Chin-Chen Chang',
    url: 'https://doi.org/10.1007/978-3-642-34292-9_12',
  },
  {
    year: '2011',
    title: 'Fractal Territory Board Game',
    venue: 'IEEE International Games Innovation Conference 2011',
    authors: 'S. F. Siao, Hung-Wei Hsu, Wen-Kai Tai, Andrew Yip',
  },
  {
    year: '2011',
    title: '3D Object Presentation Mapping',
    venue: 'ICIG 2011（IEEE）',
    authors: 'Effendy Eka Saputra, Hung-Wei Hsu, Wen-Kai Tai',
    url: 'https://doi.org/10.1109/icig.2011.77',
  },
  {
    year: '2010',
    title: 'Permutation Steganography for Polygonal Meshes Based on Coding Tree',
    venue: 'International Journal of Virtual Reality, 9(4)',
    authors: 'Shihchun Tu, Hungwei Hsu, Wenkai Tai',
    url: 'https://doi.org/10.20870/ijvr.2010.9.4.2790',
  },
  {
    year: '2010',
    title: 'Practical Shadow Map',
    venue: 'IWAIT 2010',
    authors: 'He-Jie Shih, Hung-Wei Hsu, Wen-Kai Tai',
  },
  {
    year: '2009',
    title: 'A Novel Fractal Board Game',
    venue: 'ICIG 2009（IEEE）',
    authors: 'Siao-Fan Siao, Hung-Wei Hsu, Wen-Kai Tai',
    url: 'https://doi.org/10.1109/icig.2009.156',
  },
  {
    year: '2009',
    title: '下肢部位復健之遊戲系統（碩士論文）',
    venue: '國立東華大學資訊工程學系',
    authors: '許紘瑋（指導教授：戴文凱）',
    url: 'https://hdl.handle.net/11296/3ef8u3',
  },
];

export const patents = [
  {
    year: '2014',
    title: '新型專利 M480712「用以安裝運動感應晶片的夾設裝置」',
    authors: '戴文凱、許紘瑋、沙布魯比、林嘉志',
  },
];
