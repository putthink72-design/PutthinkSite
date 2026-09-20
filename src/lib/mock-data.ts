export type ShowcaseCategory =
  | "long_putt"
  | "multi_break"
  | "recovery"
  | "first_holed";

/** Fields users set in the Putthink app when uploading a showcase video */
export type ShowcaseCard = {
  id: string;
  category: ShowcaseCategory;
  nickname: string;
  caption: string;
  clubName: string;
  courseName: string;
  holeNumber: number;
  likes: string;
  /** Showcase feed badge (e.g. monthly rank) — optional */
  rank?: string;
};

export type HofCard = ShowcaseCard & {
  period: string;
};

export const MOCK_SHOWCASE: ShowcaseCard[] = [
  {
    id: "1",
    rank: "이달 1위",
    category: "multi_break",
    nickname: "bogey_hunter",
    caption:
      "트리플 브레이크에서 라인 안 믿었으면 절대 못 넣었어요. 조준선 보고 그대로 쳤습니다.",
    clubName: "남서울CC",
    courseName: "레이크",
    holeNumber: 7,
    likes: "1,284",
  },
  {
    id: "2",
    rank: "이달 2위",
    category: "recovery",
    nickname: "green_reader",
    caption: "오르막 + 좌경사 조합이라 감으로는 답이 안 나오던 자리였습니다.",
    clubName: "레이크사이드",
    courseName: "오션",
    holeNumber: 12,
    likes: "962",
  },
  {
    id: "3",
    rank: "첫 홀인",
    category: "first_holed",
    nickname: "park_golf99",
    caption: "골프 시작하고 처음으로 롱퍼트 넣어봤습니다. 손 떨렸어요.",
    clubName: "제주 오라CC",
    courseName: "한라",
    holeNumber: 3,
    likes: "734",
  },
];

export const MOCK_HOF: HofCard[] = [
  {
    id: "h1",
    period: "2026.08",
    category: "long_putt",
    nickname: "iron_will",
    caption: "이번 달 가장 멀리서 넣은 한 방. 라인 끝까지 믿었습니다.",
    clubName: "남서울CC",
    courseName: "밸리",
    holeNumber: 16,
    likes: "2,104",
  },
  {
    id: "h2",
    period: "2026.07",
    category: "multi_break",
    nickname: "slice_master",
    caption: "이중 브레이크를 읽어낸 퍼팅. 영상만 봐도 난이도가 보입니다.",
    clubName: "스카이72",
    courseName: "오션",
    holeNumber: 9,
    likes: "1,876",
  },
  {
    id: "h3",
    period: "2026.06",
    category: "recovery",
    nickname: "one_putt_kim",
    caption: "심한 내리막에서도 스피드만 맞춰 홀에 붙였습니다.",
    clubName: "블루헤런",
    courseName: "웨스트",
    holeNumber: 4,
    likes: "1,552",
  },
  {
    id: "h4",
    period: "2026.05",
    category: "first_holed",
    nickname: "rookie_jun",
    caption: "입문 직후 첫 홀인. 손이 아직도 기억합니다.",
    clubName: "제주 오라CC",
    courseName: "한라",
    holeNumber: 11,
    likes: "1,301",
  },
];

export function formatHoleLocation(
  clubName: string,
  courseName: string,
  holeNumber: number,
  holeLabel: string,
) {
  return `${clubName} · ${courseName} · ${holeNumber}${holeLabel}`;
}

export const MOCK_FIELD_TESTS = [
  {
    testNo: 5,
    date: "2026-08-12",
    total: 30,
    holed: 4,
    conceded: 26,
  },
  {
    testNo: 4,
    date: "2026-06-20",
    total: 30,
    holed: 3,
    conceded: 27,
  },
  {
    testNo: 3,
    date: "2026-04-08",
    total: 24,
    holed: 2,
    conceded: 21,
  },
];

/** Registered KR patents (Nasaem Co., Ltd.). */
export const PATENTS = [
  {
    no: "10-2053911",
    registered: "2019.12.03",
    title: "골프 가이드 시스템 및 이를 이용한 골프 가이드 방법",
  },
  {
    no: "10-2148254",
    registered: "2020.08.20",
    title: "IoT 기반 스마트 퍼팅 가이드 제공 시스템 및 그 방법",
  },
  {
    no: "10-2202594",
    registered: "2021.01.07",
    title: "퍼팅 가이드 제공 시스템 및 그 방법",
  },
];
