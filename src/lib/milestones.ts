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

/** 日期顯示：2016.03.15／2016.03／2016 */
export const formatMilestoneDate = (date: string) => date.replaceAll('-', '.');

/** 首頁分段圖：每年一圈，記錄件數與那一年的代表事件 */
export function laps() {
  const years = [...byYear().entries()].sort((a, b) => a[0] - b[0]);
  return years.map(([year, list]) => {
    const chronological = [...list].reverse();
    const headline = chronological.find((m) => m.lap) ?? chronological.find((m) => m.major) ?? chronological[0];
    return { year, count: list.length, majors: list.filter((m) => m.major).length, headline };
  });
}
