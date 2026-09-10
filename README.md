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
| `/{locale}/proof` | 필드 테스트 |
| `/{locale}/showcase` | 퍼팅 뽐내기 |
| `/{locale}/hof` | 명예의 전당 |
| `/{locale}/pricing` | 요금제 |
| `/{locale}/support` | FAQ·문의 |
| `/{locale}/press` | 보도자료 |
| `/{locale}/terms` | 이용약관 |
| `/{locale}/privacy` | 개인정보처리방침 |
| `/{locale}/data-room/request` | Data Room 접근 요청 |
| `/{locale}/data-room` | Data Room 대시보드 |

## Supabase

1. 프로젝트 생성 후 `.env.local`에 URL/키 설정
2. `supabase/schema.sql` 실행
3. (이미 schema 적용한 DB라면) `supabase/storage_putt_showcase.sql` 실행 — 버킷 `putt-showcase` + Storage RLS
4. `supabase/rpc_showcase_hof.sql` 실행 — 프로필 자동생성 · 좋아요 RPC · HoF 선정 함수
5. Auth: Sign in with Apple / Google 활성화 + Redirect URL에 `/auth/callback` 추가
6. (선택) `supabase/functions/hof-monthly` 배포 후 매월 1일 KST cron

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
