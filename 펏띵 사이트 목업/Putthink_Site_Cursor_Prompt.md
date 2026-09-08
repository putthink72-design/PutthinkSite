# 펏띵(Putthink) 공식 사이트 — Cursor 개발 프롬프트 (v2)

이 문서를 Cursor에 통째로 붙여넣고 작업을 시작하세요. 첨부된 **`putthink_site_mockup_v2.html`**이 디자인 소스 오브 트루스입니다 — 색상·타이포·간격·레이아웃을 임의로 바꾸지 말고 그대로 Next.js 컴포넌트로 옮기세요. (구버전 `mockup.html`은 폐기되었습니다 — 참고하지 마세요.)

Data Room 두 화면(`/data-room`, `/data-room/request`)은 별도 파일 **`data_room_mockup.html`**이 소스입니다.

---

## 0. 프로젝트 전제 — 반드시 먼저 읽을 것

**이 사이트는 "출시 전 대기 사이트"가 아니라 "앱스토어에 이미 올라간 상용 서비스 사이트"를 기준으로 만듭니다.** 출시 전이라고 waitlist 폼을 여기저기 넣으면 출시 직후 사이트를 통째로 다시 손봐야 하므로, 처음부터 **모든 주요 CTA는 App Store 다운로드 링크**로 만드세요. "출시 알림 받기" 같은 문구·폼은 이 버전에 존재하지 않습니다.

**요금제 구조 (정확히 이 구조로 구현할 것)**
- 다운로드 즉시: **무료 실행 9회** (카드 등록 없음)
- 9회 소진 후 구독 시작: **3일 무료체험** → 이후 월($9.99)/3개월($24.99)/6개월($44.99)/연($74.99)
- 초대 링크로 들어온 신규 유저: **무료 실행 18회**(기본 9회의 2배) + 구독 시작 시 **7일 무료체험**(기본 3일의 2배 이상)
- 이 두 트랙(일반 vs 초대)은 명확히 다른 값이며 섞으면 안 됩니다.

**필드테스트 공식 수치(문구·숫자 변경 금지)**: 30회 퍼팅 중 **홀인 4회**, 나머지 **26회 컨시드**(75cm 이내) 성공.

**존재하지 않는 기능 — 절대 있는 것처럼 카피 쓰지 말 것**
- ❌ 앱 내 영상 녹화 기능 없음. 발열·성능 문제로 iOS 기본 화면 녹화(Control Center)를 쓰도록 안내하는 방식입니다.
- ❌ 거리·경사각·조준각 자동 메타데이터 첨부 기능 없음. "퍼팅 뽐내기" 업로드 시 사용자가 화면에 찍힌 값을 **직접 입력**합니다. 검증은 "조준 화면(OSD)이 영상에 그대로 찍혀 있어서 다른 사람이 눈으로 확인 가능하다"는 점으로 이루어집니다 — 이게 이 기능의 핵심 설계 원리이니 정확히 구현하세요.
- ❌ 라운드 기록 자동 저장 기능 없음. 마케팅 카피에서도 언급하지 마세요.
- ❌ 사전 확보된 골프장 그린 데이터(항공측량/UTMK) 없음. 펏띵은 라이다 실시간 스캔이 전부입니다. "Course Data" 류의 섹션·페이지를 만들지 마세요.

---

## 1. 기술 스택

- **프레임워크**: Next.js 14+ (App Router), TypeScript
- **스타일링**: Tailwind CSS — 2장의 디자인 토큰을 `tailwind.config.ts`의 `theme.extend`에 반영. 색상 하드코딩 금지, 전부 토큰 참조
- **백엔드**: Supabase (Postgres + Auth + Storage)
- **폰트**: Pretendard(본문/헤드라인) + JetBrains Mono(숫자·통계·라벨)
- **결제/구독**: StoreKit 2 (앱 자체) + **App Store Server Notifications V2**를 수신하는 백엔드 웹훅(Supabase Edge Function) — 구독 시작 이벤트를 감지해 초대 크레딧을 정산하는 데 필수
- **배포**: Vercel. 환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`(서버 전용)
- **영상 업로드**: Supabase Storage (사용자가 iOS로 녹화한 영상 파일을 업로드)

---

## 2. 디자인 토큰 (`putthink_site_mockup_v2.html`에서 추출)

```css
/* 색 — 원칙: 앰버는 "제품 화면 안"과 "크레딧/보상" 맥락에서만 사용.
   사이트 크롬(nav, 배경, 버튼 등 일반 UI)은 전부 무채색. */
--ink:#0A0A0A;      /* 메인 다크 배경 */
--ink-2:#141414;     /* 카드/bento 배경 */
--ink-3:#1E1E1E;
--bone:#F3F1EB;      /* 메인 라이트 배경 & 다크 위 텍스트 */
--bone-2:#E8E5DC;
--turf:#0F3A28;      /* 명예의 전당 등 포인트 섹션 배경 */
--turf-2:#16543A;

--amber:#FFB020;     /* 시그니처 액센트 — 제품 화면·크레딧 보상 문맥에서만 */
--amber-ink:#150E02;

--g-1:#8A8A85; --g-2:#5A5A56;   /* 회색 텍스트 2단계 */
--line-d:rgba(255,255,255,.10); /* 다크 배경 위 보더 */
--line-l:rgba(10,10,10,.10);    /* 라이트 배경 위 보더 */

--font:'Pretendard', -apple-system, sans-serif;
--mono:'JetBrains Mono', ui-monospace, monospace;  /* 숫자·통계·타임스탬프 전용 */
```

**섹션 배경 교차 패턴** (mockup 그대로 유지): 다크(ink) → 라이트(bone) → 딥터프(turf) → 라이트(bone) → 다크(ink). 전부 라이트나 전부 다크로 밀지 말 것 — 이 교차 리듬이 디자인의 핵심입니다.

**타이포 규칙**
- 헤드라인(h1/h2) 폰트: Pretendard 800(ExtraBold), `letter-spacing:-0.04~-0.055em`
- **한글 줄바꿈 필수**: `word-break: keep-all` 전역 적용 (안 하면 단어 중간에서 줄바꿈됨)
- **한글 line-height 주의**: h1은 `1.08` 이상, h2는 `1.16` 이상 — `.98`처럼 라틴 문자 기준으로 타이트하게 잡으면 한글 글자가 위아래로 겹칩니다.
- 숫자(통계, 가격 등): `font-variant-numeric: tabular-nums` + JetBrains Mono, `.mono` 유틸리티 클래스로 통일

**레이아웃**
- **Bento 그리드**: `.bento{grid-template-columns:repeat(3,1fr)}`, 카드에 `.wide`(2칸)·`.full`(전체폭) 모디파이어. **1000px 이하에서는 bento를 무조건 1열로 전환**(2열 중간 상태를 두면 남는 칸이 애매하게 비어 보이는 버그 발생)
- 그레인 텍스처: `body::after`에 SVG feTurbulence 기반 노이즈, opacity 0.035
- 국기 아이콘: **이모지 절대 금지**(Windows에서 텍스트로 깨짐). mockup 상단 `<svg style="display:none">` 스프라이트를 이식해 `<use>`로 참조

---

## 3. 사이트 구조 (라우팅)

```
/                     홈
/how-it-works         작동 원리 상세
/technology           기술·특허 상세
/proof                필드 테스트 전체 이력
/showcase             퍼팅 뽐내기 — 전체 피드 + 카테고리 필터
/hof                  명예의 전당 — 역대 월간 1위 아카이브
/pricing              요금제
/support              FAQ + 문의
/press                보도자료 + 미디어킷
/data-room            매수자 전용 (게이트)
/data-room/request    접근 요청 폼 (공개)
```

홈(`/`) 섹션 순서: Nav → Hero(App Store CTA) → Proof bar(4 stats) → How it works(bento) → Showcase(피드 미리보기 3개) → Hall of Fame(4개 카드) → Pricing(3 plans) → Invite(2-card 비교) → CTA → Footer.

---

## 4. 핵심 기능 스펙

### 4.1 퍼팅 뽐내기 (Showcase)

**업로드 플로우** (반드시 이 순서로):
1. 조준 완료 → 앱이 "지금 iOS 화면 녹화를 켜세요" 안내 배너 표시
2. 사용자가 직접 화면 녹화 후 퍼팅
3. "뽐내기 업로드" 화면에서 방금 찍힌 영상 선택
4. **사용자가 직접** 실거리·경사각(β)·카테고리(롱퍼트/다중브레이크 난이도/극복/첫 홀인) 입력
5. 업로드 → Supabase Storage 저장, `putt_showcase`에 메타데이터 insert

**검증 원리**: 조준 화면 자체가 영상에 찍혀 있어 입력값과 실제 화면이 다르면 다른 유저가 바로 알 수 있습니다. 신고 버튼만 있으면 되고 서버 자동 검증 로직은 불필요합니다.

**카테고리는 필터일 뿐 부문 심사가 아님**: 업로드 시 자기신고 태그이자 피드 필터 탭입니다. 운영자가 매달 심사하는 "부문 시상"은 없습니다.

### 4.2 명예의 전당 (Hall of Fame) — 완전 자동, 무심사

- 매달 좋아요 1위 `putt_showcase` 게시물이 자동 등재
- 매월 1일 00:00 KST Supabase Edge Function(cron)이 지난달 1위를 조회해 `hall_of_fame`에 insert
- 등재와 동시에 작성자에게 무료 실행 크레딧 자동 지급(4.3 참고)
- 운영자 개입 없음 — "이달의 챌린지"(회전 주제, 수동 심사)는 저관여 운영 방침에 따라 폐기됨. 재도입 금지

### 4.3 무료 실행 크레딧 — Apple 결제와 분리된 자체 화폐

Apple StoreKit이 못 건드리는 완전 자체 관리 숫자입니다. 활성 구독 여부와 무관하게 항상 유효합니다.

- 신규 유저: `free_runs_balance = 9`(일반) 또는 `18`(초대 링크 설치)로 초기화
- 스캔+조준 1회마다 `-1`(활성 구독 중이면 차감 안 함)
- 지급 트리거(+9, 동일 로직): ① 내가 초대한 친구가 구독을 시작하는 순간(App Store Server Notification `SUBSCRIBED` 수신 → 초대 관계 매칭), ② 명예의 전당 월간 1위 선정 시
- **구독 중인 유저도 계속 쌓입니다** — 당장 못 써도 사라지지 않고 나중에 구독 해지/중지 시 그대로 사용 가능. "구독 여부 무관 공평한 보상" 설계 원칙의 핵심 구현입니다.

### 4.4 초대(Invite) 플로우

1. 앱 내 고유 초대 링크 생성(딥링크, 예: `putthink.com/i/{code}`)
2. 링크로 설치한 신규 유저: `referred_by` 저장, `free_runs_balance = 18`
3. 그 유저가 구독 시작 시: App Store Connect **Offer Code**로 7일 체험 적용 + App Store Server Notification 수신 → 인바이터에게 +9 크레딧
4. 초대 횟수 제한 없음

---

## 5. Supabase 스키마

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  free_runs_balance int not null default 9,
  referred_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table putt_showcase (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  video_url text not null,
  distance_m numeric not null,        -- 사용자 직접 입력
  break_angle numeric,                 -- 사용자 직접 입력 (β, optional)
  category text not null check (category in ('long_putt','multi_break','recovery','first_holed')),
  likes_count int not null default 0,
  course_name text,
  created_at timestamptz default now()
);

create table showcase_likes (
  showcase_id uuid references putt_showcase(id) not null,
  user_id uuid references profiles(id) not null,
  created_at timestamptz default now(),
  primary key (showcase_id, user_id)
);

create table hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  period date not null unique,
  showcase_id uuid references putt_showcase(id) not null,
  created_at timestamptz default now()
);

create table credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  amount int not null,
  reason text not null check (reason in ('invite_subscribed','hof_winner')),
  related_id uuid,
  created_at timestamptz default now()
);

create table field_tests (
  id uuid primary key default gen_random_uuid(),
  test_no int not null unique,
  test_date date not null,
  total_putts int not null,
  holed int not null,
  conceded int not null,
  video_url text,
  created_at timestamptz default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, message text not null,
  created_at timestamptz default now()
);
create table press_kit_downloads (
  id uuid primary key default gen_random_uuid(),
  email text, organization text, downloaded_at timestamptz default now()
);
create table data_room_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null, organization text not null, role text, message text,
  status text default 'pending' check (status in ('pending','approved','denied')),
  approved_at timestamptz, created_at timestamptz default now()
);
create table traction_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null, country text not null,
  downloads int default 0, dau int default 0, mau int default 0,
  trial_starts int default 0, paid_subs int default 0, mrr_usd numeric default 0,
  created_at timestamptz default now(),
  unique(metric_date, country)
);
```

**RLS 정책 핵심**:
- `putt_showcase`: select는 anon 허용(공개 피드), insert는 authenticated만, 좋아요 수 update는 서버 함수만
- `profiles.free_runs_balance`: **클라이언트 직접 update 금지** — 반드시 Edge Function(서비스 롤) 경유
- `traction_metrics`: select는 인증된(Data Room 승인) 사용자만
- `hall_of_fame`, `field_tests`: select는 anon 허용, insert/update는 service role만

---

## 6. 페이지별 상세

### `/` 홈
mockup 전체 섹션 이식. **하드코딩 금지**: Proof bar 통계는 `field_tests` 최신 회차, Hall of Fame 카드는 `hall_of_fame` 최근 4개, Showcase 미리보기는 `putt_showcase` 좋아요순 상위 3개를 조회.

### `/showcase`
전체 피드 + 카테고리 필터 탭. 업로드 버튼(로그인 필요) → 4.1 플로우.

### `/hof`
`hall_of_fame` 전체 이력 최신순. 각 카드에 "자동 선정" 설명 고정 노출.

### `/technology`, `/proof`
특허 3건 상세, `field_tests` 전체를 최신순 나열.

### `/pricing`
3플랜(무료 9회 / 연간 / 월간·3개월·6개월). **연간 플랜에 "라운드 기록 저장" 같은 없는 기능 넣지 말 것** — mockup 문구("퍼팅 뽐내기 업로드 · 명예의 전당 도전", "매달 라운딩 즐기는 분께 가장 저렴") 그대로 사용.

### `/data-room/request`, `/data-room`
`data_room_mockup.html`이 소스. Supabase Auth 매직링크 + 서버사이드(`layout.tsx`) 인증 체크.

### `/press`
보도자료 본문 + 미디어킷 다운로드(이메일 입력 모달 → `press_kit_downloads` insert). 배포처 매체 리스트는 별도 마케팅 매뉴얼 문서 참고.

---

## 7. 반응형 · 접근성

- [ ] Bento 그리드 1000px 이하 1열 전환
- [ ] Invite 2-card, Showcase 3열 피드도 620px 이하 1열
- [ ] 모바일 nav 햄버거 전환
- [ ] `prefers-reduced-motion` 존중
- [ ] 폼 필드 `aria-label`/`label`, `:focus-visible` 유지

---

## 8. SEO / 메타데이터

```tsx
export const metadata = {
  title: '펏띵 Putthink — 그린을 읽어주는 AR 퍼팅 코치',
  description: '아이폰 라이다로 그린의 다중 경사를 스캔하고, AR로 퍼팅 방향과 세기를 안내합니다. 다운로드 후 9회 무료.',
  openGraph: { title: '펏띵 Putthink', description: '그린은 이미 정답을 알고 있다.', type: 'website', locale: 'ko_KR' },
}
```
`/data-room`, `/data-room/request`는 `robots: { index: false, follow: false }`.

---

## 9. 작업 순서

1. Next.js 초기화, Tailwind에 2장 토큰 반영, 폰트 세팅
2. Supabase 프로젝트 생성 → 5장 스키마 + RLS 실행
3. 정적 컴포넌트 구축 — mockup과 픽셀 단위 대조
4. `/showcase` 업로드 플로우(Supabase Storage 연동)
5. Edge Function 2개: ① 월간 명예의 전당 크론잡, ② App Store Server Notification 웹훅(초대 크레딧 정산)
6. `/pricing`, `/technology`, `/proof` 서브페이지
7. `/data-room/request` 폼 + 매직링크 + `/data-room` 게이트
8. 반응형/접근성 체크리스트 통과
9. Vercel 배포 → `putthink.com` 연결

---

## 10. 하지 말아야 할 것

- mockup에 없는 컬러·그림자·장식 추가 금지, 앰버를 일반 UI 크롬에 남용 금지
- "출시 알림 받기" 같은 pre-launch 문구·폼 금지 — 상용 출시 기준
- 앱 내 녹화, 자동 메타데이터 첨부, 라운드 기록 저장, 사전 확보 그린 데이터 등 **존재하지 않는 기능을 있는 것처럼 표현 금지**
- "이달의 챌린지" 재도입 금지
- 초대 크레딧 클라이언트 직접 증감 금지 — 반드시 서버 경유
- Apple 활성 구독에 "무료 기간 추가" 시도 금지 — StoreKit 미지원(신규 구독만 Offer Code 가능)
- 국기 이모지 사용 금지
