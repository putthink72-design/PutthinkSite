# PutthinkSite

펏띵(Putthink) 공식 웹사이트 — Next.js App Router.

## 디자인 소스

- `펏띵 사이트 목업/putthink_site_mockup_v2.html` — 마케팅 사이트
- `펏띵 사이트 목업/data_room_mockup.html` — Data Room
- `펏띵 사이트 목업/Putthink_Site_Cursor_Prompt.md` — 제품·기술 스펙

## 시작

```bash
cp .env.example .env.local
npm install
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

## 다국어 (KO / EN / JA)

- OS·브라우저 `Accept-Language`로 자동 선택
- 네비/Data Room의 언어 메뉴에서 **시스템 / 한국어 / English / 日本語** 변경 가능
- 선택값은 `PUTTHINK_LANG` 쿠키에 저장, URL은 `/ko`, `/en`, `/ja` 접두사

## 라우트

| Path | 설명 |
|------|------|
| `/{locale}` | 홈 |
| `/{locale}/how-it-works` | 작동 원리 |
| `/{locale}/technology` | 기술·특허 |
| `/{locale}/devices` | 지원 기기 (iPhone·iPad) |
| `/{locale}/proof` | 필드 테스트 |
| `/{locale}/showcase` | 퍼팅 뽐내기 |
| `/{locale}/hof` | 명예의 전당 |
| `/{locale}/pricing` | 요금제 |
| `/{locale}/support` | FAQ·문의 |
| `/{locale}/press` | 보도자료 |
| `/{locale}/terms` | 이용약관 |
| `/{locale}/privacy` | 개인정보처리방침 |
| `/{locale}/data-room/request` | Data Room 접근 요청 |
| `/{locale}/data-room` | Data Room 대시보드 (승인·매직링크 게이트) |
| `/{locale}/data-room/admin` | Data Room 요청 검토·매직링크 발송 (시크릿) |

## Supabase

1. 프로젝트 생성 후 `.env.local`에 URL/키 설정
2. `supabase/schema.sql` 실행
3. (이미 schema 적용한 DB라면) `supabase/storage_putt_showcase.sql` 실행 — 버킷 `putt-showcase` + Storage RLS
4. `supabase/rpc_showcase_hof.sql` 실행 — 프로필 자동생성 · 좋아요 RPC · HoF 선정 함수
5. Auth: Email (magic link) + Sign in with Apple / Google 활성화 + Redirect URL에 `/auth/callback` · `/auth/confirm` 추가
6. `supabase/data_room_magic_link.sql` 실행 — Data Room 승인·매직링크 컬럼/RLS
7. (선택) `supabase/functions/hof-monthly` 배포 후 매월 1일 KST cron

### Data Room 매직링크

1. 투자자가 `/data-room/request`에서 요청 → DB `pending` 저장 (이때는 링크 미발송)
2. (선택) Resend가 있으면 `DATA_ROOM_NOTIFY_EMAIL`로 신규 요청 알림
3. 운영자가 `/data-room/admin`에서 `DATA_ROOM_ADMIN_SECRET`으로 잠금 해제 후 **승인 + 매직링크**
4. 승인 시에만 일회용 매직링크 메일 발송  
   - `RESEND_API_KEY` 있으면 브랜드 메일 + `auth.admin.generateLink`  
   - 없으면 Supabase Auth OTP 메일로 폴백
5. 수신자가 링크 → `/auth/confirm?…&next=/ko/data-room` → 승인된 이메일만 대시보드 입장

필수 env: `SUPABASE_SERVICE_ROLE_KEY`, `DATA_ROOM_ADMIN_SECRET`, `NEXT_PUBLIC_SITE_URL`  
출시 전 목업을 열어 두려면 `DATA_ROOM_ALLOW_DEMO_PREVIEW=1` 과 `NEXT_PUBLIC_DATA_ROOM_ALLOW_DEMO_PREVIEW=1`

### Showcase 영상 업로드 (앱)

- 로그인 후 Storage `putt-showcase`에 업로드
- **경로 필수:** `{auth.uid()}/{filename}.mp4` (또는 `.mov`)
- 메타데이터는 `putt_showcase`에 insert (`user_id` = 본인 uid, `video_url` = public object URL)
- 한도: 400MB, MIME `video/mp4` · `video/quicktime`

### 웹 로그인 UX

- 메뉴·피드·명예의 전당은 **비로그인으로 전부 열람**
- Apple/Google 로그인은 **좋아요를 누를 때만** 모달로 표시
- 업로드 UI는 웹에 없음 (앱 전용)

## 스택

Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase
