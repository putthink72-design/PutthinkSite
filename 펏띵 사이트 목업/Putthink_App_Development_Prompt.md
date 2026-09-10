# 펏띵(Putthink) iOS 앱 — 개발 프롬프트

이 문서는 **공식 웹사이트·Supabase 스키마가 이미 준비된 상태**에서, iOS 앱(Swift)에 구현해야 할 기능을 Cursor/개발자에게 넘기기 위한 지시서입니다.  
웹 레포: `PutthinkSite` · DB SoT: `supabase/schema.sql` + `rpc_showcase_hof.sql` + `storage_putt_showcase.sql`  
비즈니스 로직 SoT: 아래 **§1 표** (구 스펙의 9회/18회·3일/7일 체험은 **폐기**).

---

## 0. 제품 한 줄 / 웹과의 역할 분담

- **앱:** LiDAR 스캔·AR 조준 · 무료실행/구독 · 초대 · **뽐내기 영상 업로드** · 좋아요 · 계정
- **웹:** 마케팅 · 피드/명예의전당 **조회** · 좋아요(웹도 가능) · 업로드 UI **없음**

카메라·LiDAR·스캔 메시는 **기본 온디바이스**. 뽐내기용으로 사용자가 고른 화면녹화 영상만 Storage로 올라갑니다.

---

## 1. 확정 비즈니스 로직 (유일한 기준)

| 항목 | 값 |
|---|---|
| 일반 설치 무료 실행 | **3회**, 카드 등록 없음 |
| 초대 링크 설치 무료 실행 | **6회** |
| 구독 무료체험 | **없음** — 결제 즉시 시작 |
| 요금제 | 월 $9.99 · 3개월 $24.99 · 6개월 $44.99 · 연 $74.99 |
| 초대자 리워드 — 한 번도 구독 안 함 | 친구가 **구독 결제 시작** 시 **무료실행 +3** |
| 초대자 리워드 — 구독 중/과거 구독 | 같은 순간 **다음 결제 1주 무료** (Apple Promotional Offer, 해지 불필요) |
| 초대 리워드 반복 제한 | **없음** |
| 무료실행 어뷰징 방지 | **기기(Keychain) + 계정(Supabase)** 이중, 최초 1회만 지급 |

카피 금지: “무료체험 3일/7일”, “체험판”.

활성 구독 중이면 스캔 시 `free_runs_balance`를 **차감하지 않음**.  
크레딧은 구독과 무관하게 잔액으로 남고, 구독이 없을 때 소진.

---

## 2. 인증 UX (필수)

- Sign in with **Apple** + **Google** → Supabase Auth (`auth.users` → `profiles.id`)
- **메뉴·주요 기능 화면을 로그인 강제/숨김 금지**
- 로그인은 **필요 기능 실행 시**에만 시트/모달로 표시:
  - 뽐내기 **업로드**
  - **좋아요**
  - (선택) 초대 링크 생성·보상 수령 확인
- 스캔/조준 자체는 비로그인+무료실행으로 가능해야 함 (잔액·기기 클레임만으로)

로그인 후 `profiles` 행은 DB 트리거 `handle_new_user`가 생성. 앱은 `id = auth.uid()`만 신뢰.

---

## 3. 무료 실행 · 기기 클레임

1. 앱 최초 실행 시 Keychain에 안정적 `device_keychain_id`(UUID) 저장 (삭제 재설치에도 유지).
2. 로그인(또는 익명 세션이 있다면 그 시점) 후 Edge Function/서비스롤 API로만 지급:
   - 해당 `device_keychain_id` 또는 계정에 아직 `free_tier_claimed = false`일 때만
   - `referred_by` 있으면 `free_runs_balance = 6`, `free_tier_source = 'invited'`
   - 없으면 `= 3`, `source = 'organic'`
   - `device_keychain_id` 저장, `free_tier_claimed = true`
3. **클라이언트에서 `free_runs_balance` 직접 UPDATE 금지** — 차감도 Edge Function 또는 SECURITY DEFINER RPC만.
4. 스캔+조준 **1회 완료**마다: 비구독이면 −1.

---

## 4. StoreKit 구독

- 상품: monthly / quarterly / semi-annual / annual (가격은 §1)
- **Introductory offer / 무료 체험 기간 넣지 말 것**
- App Store Server Notifications V2 → Supabase Edge Function
  - `SUBSCRIBED` / 갱신 / 해지 상태 서버 반영
  - 초대 관계 매칭 시 초대자 리워드 지급 (§5)

---

## 5. 초대 (Invite)

1. 로그인 유저에게 고유 코드/딥링크 발급  
   예: `https://putthink.com/i/{code}` → Universal Link → 앱 설치·오픈 시 `referred_by` 후보 저장
2. 피초대자가 **첫 구독 결제 시작** 시 (ASSN):
   - 초대자가 **never subscribed** → `free_runs_balance += 3`, `credit_ledger(reason=invite_subscribed, amount=3)`, `invite_rewards(reward_type='credit_3')`
   - 초대자가 **subscribed or lapsed** → Apple **Promotional Offer 1주** 서명·전달, `invite_rewards(reward_type='promo_offer_1week')`  
     (크레딧 원장에 promo를 넣지 말 것)
3. 반복 상한 없음. 감사 로그만 `invite_rewards`에 남김.

---

## 6. 퍼팅 뽐내기 (Showcase) — 앱 전용 업로드

### 6.1 업로드 플로우 (순서 고정)

1. 조준 완료 → **“지금 iOS 화면 녹화를 켜세요”** 배너
2. 사용자 화면 녹화 후 퍼팅
3. “뽐내기 업로드”에서 영상 선택
4. **사용자가 직접 입력/선택** (자동 메타 첨부 금지 — 거리·β 자동 기입 없음):
   - `category`: `long_putt` | `multi_break` | `recovery` | `first_holed`
   - `nickname` (Apple/Google 표시명 기본값 가능, 수정 가능)
   - `caption` (한줄평)
   - `club_name` (골프장)
   - `course_name` (코스)
   - `hole_number` (1–18)
5. (권장) 업로드 전 **화질 열화 최소 재인코딩**으로 용량 축소 후 전송 (파일당 Storage 한도 **400MB**)
6. Storage 업로드 → `putt_showcase` insert

### 6.2 Storage

- 버킷: `putt-showcase` (public 읽기 URL)
- **경로 필수:** `{auth.uid()}/{uuid}.mp4` (또는 `.mov`)
- MIME: `video/mp4`, `video/quicktime`
- `video_url`: public object URL을 `putt_showcase.video_url`에 저장
- RLS: 본인 폴더만 insert/update/delete

### 6.3 검증 원리

조준 OSD가 영상에 찍혀 있음 → 서버 자동 검증 불필요. 신고 UI만 있으면 됨.  
카테고리는 **필터 태그**일 뿐 부문 심사 아님.

---

## 7. 좋아요

- 테이블: `showcase_likes` (PK: showcase_id + user_id)
- 클라이언트: 본인 행 insert / delete만 (RLS)
- `likes_count`는 DB 트리거 `sync_showcase_likes_count`가 갱신 — **앱이 likes_count 직접 update 금지**
- 로그인 필요 시에만 로그인 시트

웹도 동일 규칙으로 좋아요 가능. 앱 피드와 숫자 공유.

---

## 8. 명예의 전당

- **앱/웹 모두 조회만** (선정은 서버)
- 매월 1일 KST 전후 Edge Function `hof-monthly` → `induct_hof_month(prev_month)`
  - 해당 월 `putt_showcase` 중 `likes_count` 1위 → `hall_of_fame`
  - 작성자 `free_runs_balance += 3`, `credit_ledger(reason=hof_winner, amount=3)`
- “이달의 챌린지”·운영자 심사 **재도입 금지**

앱 UI: 최근 HoF 카드 + 웹 `/hof` 딥링크 가능.

---

## 9. Supabase 연동 체크리스트 (앱)

환경변수: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (서비스 롤은 앱에 넣지 말 것).

| 작업 | 클라이언트 | 서버(Edge/서비스롤) |
|---|---|---|
| Apple/Google 로그인 | O | — |
| 무료티어 최초 지급 | — | O |
| free_runs 차감 | — | O |
| Storage 업로드 | O (auth) | — |
| putt_showcase insert | O (auth, 본인 user_id) | — |
| showcase_likes | O | — |
| 구독 상태/초대 리워드 | StoreKit + 수신 | ASSN 웹훅 O |
| HoF 선정 | — | cron O |

`profiles.free_runs_balance` / `credit_ledger` / `invite_rewards` / `induct_hof_month` 는 클라이언트 임의 호출 금지.

---

## 10. UX / 카피 주의

- KO / EN / JA 지원 (웹과 톤 맞춤)
- 요금·초대 문구는 §1과 웹 `Invite`/`Pricing` 카피 정합
- Legal: 앱 내 EULA/개인정보 — 스캔 온디바이스, 뽐내기 영상은 사용자 업로드임을 명시

---

## 11. 구현 우선순위 (권장)

1. Supabase Auth (Apple/Google) + 온디맨드 로그인 시트  
2. Keychain device id + 무료티어 지급 Edge Function + 실행 차감  
3. StoreKit 구독 (체험 없음) + ASSN 웹훅 골격  
4. Showcase 업로드 (압축 → Storage → insert)  
5. 앱 내 피드 조회 + 좋아요  
6. 초대 딥링크 + 리워드 (credit_3 / promo 1주)  
7. HoF 조회 UI  

---

## 12. 명시적 비범위

- 웹사이트 업로드 UI
- 구독 무료 체험 기간
- 거리(m)·경사각(β) 자동 메타 첨부
- Data Room (웹 전용)
- 운영자 수동 HoF 심사

---

## 13. 참고 파일 (웹 레포)

- `supabase/schema.sql`
- `supabase/storage_putt_showcase.sql`
- `supabase/rpc_showcase_hof.sql`
- `supabase/functions/hof-monthly/index.ts`
- `펏띵 사이트 목업/Putthink_Website_Update_Prompt.md` (비즈니스 로직 배경)
- `README.md` (Storage 경로·Auth 콜백)

이 프롬프트와 DB 스키마가 충돌하면 **§1 표 + schema.sql**을 따릅니다.
