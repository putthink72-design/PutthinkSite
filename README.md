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
3. Storage 버킷 `putt-showcase` 생성 (영상 업로드용)

## 스택

Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase
