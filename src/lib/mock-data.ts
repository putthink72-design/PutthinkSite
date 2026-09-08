export const MOCK_SHOWCASE = [
  {
    id: "1",
    rank: "이달 1위",
    chips: [
      { text: "β 14.2°", hot: true },
      { text: "12.4m", hot: false },
      { text: "−1.8m 내리막", hot: false },
    ],
    user: "bogey_hunter",
    caption:
      "트리플 브레이크에서 12m 넘게 들어갔습니다. 라인 안 믿었으면 절대 못 넣었어요.",
    meta: "남서울CC · 4일 전",
    likes: "1,284",
    category: "multi_break" as const,
  },
  {
    id: "2",
    rank: "이달 2위",
    chips: [
      { text: "β 11.6°", hot: true },
      { text: "8.2m", hot: false },
      { text: "+1.2m 오르막", hot: false },
    ],
    user: "green_reader",
    caption: "오르막 + 좌경사 조합이라 감으로는 답이 안 나오던 자리였습니다.",
    meta: "레이크사이드 · 6일 전",
    likes: "962",
    category: "recovery" as const,
  },
  {
    id: "3",
    rank: "첫 홀인",
    chips: [
      { text: "5.1m", hot: false },
      { text: "β 6.8°", hot: false },
      { text: "입문 3주차", hot: true },
    ],
    user: "park_golf99",
    caption: "골프 시작하고 처음으로 롱퍼트 넣어봤습니다. 손 떨렸어요.",
    meta: "제주 오라CC · 2일 전",
    likes: "734",
    category: "first_holed" as const,
  },
];

export const MOCK_HOF = [
  {
    period: "2026.08",
    user: "iron_will",
    detail: "15.2m · β 12.8° 롱퍼트",
  },
  {
    period: "2026.07",
    user: "slice_master",
    detail: "β 16.4° 다중브레이크",
  },
  {
    period: "2026.06",
    user: "one_putt_kim",
    detail: "−2.4m 내리막 극복",
  },
  {
    period: "2026.05",
    user: "rookie_jun",
    detail: "9.8m 첫 홀인",
  },
];

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

export const PATENTS = [
  {
    no: "10-2148254",
    title: "다중 경사 그린 퍼팅 경로 예측 방법",
    summary: "라이다 높이맵 기반 다중 브레이크 볼 궤적 물리 모델",
  },
  {
    no: "10-2202594",
    title: "AR 기반 퍼팅 조준 안내 시스템",
    summary: "카메라 화면 위 실측 조준선 오버레이 및 보정 거리 표시",
  },
  {
    no: "10-2053911",
    title: "평지 환산 거리 산출 방법",
    summary: "오르막·내리막을 반영한 체감 거리 환산 알고리즘",
  },
];
