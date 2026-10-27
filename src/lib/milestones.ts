import { milestones, type Milestone, type MilestoneCategory } from '../data/milestones';

export const categories: Record<MilestoneCategory, string> = {
  rq: '創業',
  study: '學業',
  running: '跑步',
  family: '家庭',
  investing: '投資',
  creative: '創作',
  fanpage: '粉絲專頁',
  media: '媒體與演講',
  life: '人生',
};

const key = (m: Milestone) => m.date.padEnd(10, '-');

/** 由新到舊 */
export function sortedMilestones() {
  return [...milestones].sort((a, b) => key(b).localeCompare(key(a)));
}

export const yearOf = (m: Milestone) => Number(m.date.slice(0, 4));

export function byYear() {
  const map = new Map<number, Milestone[]>();
  for (const m of sortedMilestones()) {
    const y = yearOf(m);
    map.set(y, [...(map.get(y) ?? []), m]);
  }
  return map;
}

/** 成就點數：一般 10 點，重要時刻 50 點（純好玩的遊戲規則） */
export const pointsOf = (m: Milestone) => (m.major ? 50 : 10);

export function achievementStats() {
  return {
    count: milestones.length,
    points: milestones.reduce((n, m) => n + pointsOf(m), 0),
    majors: milestones.filter((m) => m.major).length,
  };
}

/** 日期顯示：2016.03.15／2016.03／2016 */
export const formatMilestoneDate = (date: string) => date.replaceAll('-', '.');

/** 分段圖從跑力計算器那年開始一年一圈，更早的東華求學時期併成一格「起跑前」 */
export const LAP_START = 2013;

/** 首頁分段圖：每年一圈，記錄件數與那一年的代表事件 */
export function laps() {
  const years = [...byYear().entries()].sort((a, b) => a[0] - b[0]);
  const pick = (list: Milestone[]) => {
    const chronological = [...list].reverse();
    return chronological.find((m) => m.lap) ?? chronological.find((m) => m.major) ?? chronological[0];
  };
  const before = years.filter(([y]) => y < LAP_START).flatMap(([, list]) => list);
  const prelude = before.length
    ? [
        {
          year: LAP_START - 1,
          label: `~${LAP_START - 1}`,
          count: before.length,
          majors: before.filter((m) => m.major).length,
          headline: { title: '新手村：東華資工與 GAMELab', short: '新手村：東華' } as Pick<Milestone, 'title' | 'short'>,
        },
      ]
    : [];
  return [
    ...prelude,
    ...years
      .filter(([y]) => y >= LAP_START)
      .map(([year, list]) => ({
        year,
        label: String(year),
        count: list.length,
        majors: list.filter((m) => m.major).length,
        headline: pick(list) as Pick<Milestone, 'title' | 'short'>,
      })),
  ];
}
