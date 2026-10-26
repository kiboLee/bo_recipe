# Development Guidelines

> AI 에이전트 전용 프로젝트 규칙. 일반 개발 지식은 포함하지 않는다.
> 기준 문서: `CLAUDE.md`, `AGENTS.md`, `docs/PRD.md`, `docs/ROADMAP.md`

## 0. 현재 상태

- **서비스**: 요리 레시피 (재료 기반 1인분 레시피 목록·상세, Supabase DB, ISR)
- **구현 완료**: 라우트 골격, DTO, Supabase 연동 repository, 목록 필터·정렬, 상세 조회와 404, 목록·상세 UI
- **남은 작업**: `docs/ROADMAP.md`의 Phase 3 이후 Task (PDF, 마감, 배포)
- **규칙**: 현재 코드에 없는 파일(예: `tasks/`, `app/api/`)은 **존재한다고 가정하지 않는다**. 로드맵 Task를 시작할 때 명세에 따라 생성한다.

## 1. Project Overview

- Next.js 16.3.8 (App Router), React 19.2.8, TypeScript 5 (strict), Tailwind CSS v4, shadcn/ui(`base-nova`), `@base-ui/react`, lucide-react, class-variance-authority, `@supabase/supabase-js`
- 패키지 매니저: npm (`package-lock.json` 존재). yarn/pnpm 명령 사용 금지
- 실행: `npm run dev` / `npm run build` / `npm start` / `npm run lint`

## 2. Project Architecture (현재 파일 맵)

```
app/
  layout.tsx              # 루트 레이아웃 (lang="ko", Geist 폰트, metadata, 헤더·메인·푸터)
  page.tsx                # 홈: /recipes로 리다이렉트
  recipes/page.tsx        # 목록: searchParams 파싱 → service 호출
  recipes/[slug]/page.tsx # 상세: generateStaticParams, dynamicParams = false, notFound()
  not-found.tsx, loading.tsx, error.tsx
  components/
    Header.tsx            # 서버 컴포넌트, 로고(→ /recipes) + 테마 전환
    Footer.tsx            # 서버 컴포넌트, 소개 문구와 저작 표기
    ThemeToggle.tsx       # 'use client', 라이트/다크 전환
    state/                # 로딩 스켈레톤, 빈 결과, 에러 공통 컴포넌트
components/recipes/       # RecipeCard, RecipeFilterPanel, RecipeDetailView
components/ui/            # shadcn 생성 파일 (button, card, badge, checkbox, select, collapsible)
services/recipe-service.ts       # listRecipes, getRecipeBySlug, 순수 함수 filterRecipes·sortRecipes
repositories/supabase-client.ts  # Supabase 클라이언트 싱글턴 (서버 전용)
repositories/recipe-repository.ts# 쿼리, 행 → DTO 변환, 필수값·JSON 검증
dto/recipe.dto.ts         # 응답 타입과 열거 타입
lib/env.ts                # 환경 변수 검증
lib/recipe-options.ts     # 카테고리·난이도·정렬 옵션 목록과 타입 가드
supabase/seed.sql         # 샘플 데이터 INSERT
docs/PRD.md, docs/ROADMAP.md
```

### 레이어 규칙
- **`app/`(화면)은 `services/`만 호출한다.** `repositories/`를 직접 부르지 않는다.
- **Supabase 호출은 `repositories/`에만 둔다.** 행(snake_case) → DTO(camelCase) 변환도 여기서 한다.
- **필터·정렬 규칙은 `services/`의 순수 함수에만 둔다.** 화면 컴포넌트에서 레시피를 직접 거르지 않는다.
- **응답 타입은 `dto/`에만 둔다.** 다른 계층을 import하지 않는다.

## 3. Code Standards

### 필수 규칙 (MUST)
- **주석은 한국어**로 작성한다 (CLAUDE.md).
- **변수·함수·컴포넌트명은 영어**로 작성한다 (camelCase 변수/함수, PascalCase 컴포넌트/타입).
- 들여쓰기는 **2칸 공백**. 따옴표는 기존 파일 스타일을 따른다 (`app/components/*`, `lib/*`, `services/*`, `repositories/*`: 작은따옴표; `app/layout.tsx`, `components/ui/*`: 큰따옴표). **같은 파일 안에서 혼용 금지**.
- 클라이언트 훅·이벤트를 쓰는 파일 최상단에만 `'use client';`를 둔다.
- import 경로는 `@/*` 별칭을 사용한다.
- 컴포넌트 export는 `export function Name()` 형태를 따른다 (`export default`는 `app/page.tsx`, `app/layout.tsx`, `app/**/page.tsx`에서만 사용).
- props 타입은 `interface XxxProps {}`로 선언하고, 필드 바로 위에 한 줄 한국어 주석을 둔다.
- 매직 넘버는 파일 상단 `const`로 선언한다 (`PAGE_SIZE`, `SLUG_PATTERN` 패턴).
- 타입 안정성: `any` 사용 금지. TypeScript strict를 유지한다. DB 응답의 jsonb 값은 `unknown`으로 받고 검증 후 사용한다.
- 스타일은 **Tailwind 유틸리티 클래스**만 사용한다. 인라인 `style={{}}` 사용 금지 (동적 값 제외).
- 다크모드는 `dark:` 접두사 또는 시맨틱 토큰(`bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`)을 사용한다. 하드코딩 색상(`bg-white`, `text-black`) 금지.
- 조건부 클래스는 `cn()` (`@/lib/utils`)으로 합친다.

### 금지 (MUST NOT)
- `service_role` 키를 프로젝트 코드나 클라이언트 번들에 넣지 않는다.
- `dangerouslySetInnerHTML` 사용 (DB에서 온 본문 포함).
- `crypto.randomUUID()` 외 임의 ID 생성 방식 신규 도입 금지.

## 4. Functionality Implementation Standards

### 4-1. 레시피 목록 필터·정렬 변경
- **수정 파일**: `services/recipe-service.ts` (`filterRecipes`, `sortRecipes`, `parseRecipeListQuery`).
- 재료 필터는 **AND 조건**(선택한 재료를 모두 포함). 카테고리·난이도는 단일 조건.
- 정렬 옵션을 추가하면 `lib/recipe-options.ts`, `dto/recipe.dto.ts`(`RecipeSortOption`), `RecipeFilterPanel`을 함께 고친다.
- 잘못된 URL 쿼리 값은 무시하고 기본값으로 처리한다 (`parseRecipeListQuery`).

### 4-2. 데이터 필드 추가·변경
- Supabase 컬럼을 바꾸면 **같은 작업에서** `repositories/recipe-repository.ts`(SELECT 목록, 행 타입, 변환), `dto/recipe.dto.ts`, `supabase/seed.sql`, `docs/PRD.md` 6장을 맞춘다.
- jsonb 컬럼(`ingredient_items`, `steps`)은 repository에서 검증한 뒤 DTO로 넘긴다. 검증 실패 항목은 제외하고 `warn`으로 로그를 남긴다.
- 재료 상세가 없는 레시피는 목록과 상세 모두에서 제외한다.

### 4-3. 이미지
- 대표 이미지는 repository의 `toSafeImageUrl`에서 검증한다. 상대 경로(public 자산)와 `https` + `*.supabase.co`만 허용하고, 그 밖이면 `/recipe-placeholder.svg`를 쓴다.
- 허용 호스트를 바꾸면 `next.config.ts`의 `remotePatterns`와 `ALLOWED_IMAGE_HOST_SUFFIX`를 함께 바꾼다.

### 4-4. 라우트와 404
- 상세 경로는 `generateStaticParams`로 발행 슬러그를 빌드 시 만들고, `dynamicParams = false`로 나머지는 404로 둔다.
- 슬러그 형식(영문 소문자, 하이픈)이 틀리면 조회 없이 `null`을 반환하고 `notFound()`를 호출한다.
- 새 라우트는 `app/<path>/page.tsx`로 만들고, 필요한 경우 `loading.tsx`, `error.tsx`를 함께 검토한다.

### 4-5. 헤더·레이아웃 변경
- **헤더**: `app/components/Header.tsx`. 현재 로고와 테마 전환만 있다. 메뉴를 추가하면 실제 경로가 있을 때만 넣는다.
- **푸터**: `app/components/Footer.tsx`. 내부 링크는 두지 않는다 (헤더 로고로 충분).
- **루트 레이아웃**: `app/layout.tsx`. `<html lang="ko">` 유지. 폰트 변수 `--font-geist-sans`, `--font-geist-mono` 유지.
- 전역 메타데이터는 `layout.tsx`의 `metadata`에만 둔다.

### 4-6. shadcn/ui 컴포넌트
- `components/ui/*`는 **shadcn CLI 생성 파일**. 직접 수정하지 않는다. 변형은 `variant`/`size` 값으로 사용한다.
- 새 shadcn 컴포넌트는 `npx shadcn add <name>`으로 추가한다. `components.json`의 alias(`@/components/ui`, `@/lib/utils`)를 따른다.
- `button.tsx`는 `cn`을 `"cn"` 패키지에서 import하고, `lib/utils.ts`는 같은 `cn`을 재export한다. 이 구조를 바꾸지 않는다.

### 4-7. Next.js 16 작업 전 필수 확인
- `AGENTS.md` 지침에 따라 API·컨벤션을 쓰기 전 `node_modules/next/dist/docs/`의 관련 가이드를 읽는다.
- 라이브러리 문서가 필요하면 Context7 MCP(`resolve-library-id` → `query-docs`)를 사용한다.

## 5. Framework / Library Usage Standards

| 라이브러리 | 규칙 |
|---|---|
| Next.js 16 | `next/link`로 내부 링크. `<a href>` 금지 (내부 경로). 서버 컴포넌트 기본, 훅·이벤트 필요 시 `'use client'` |
| React 19 | 새 Effect는 cleanup 작성 |
| Tailwind v4 | `globals.css`의 테마 토큰 사용. `tailwind.config` 파일 신규 생성 금지 (v4 CSS 기반) |
| lucide-react | `import { Icon } from 'lucide-react'` named import. 전체 import 금지 |
| @base-ui/react | `components/ui/button.tsx`에서만 직접 import |
| @supabase/supabase-js | `repositories/supabase-client.ts`에서만 클라이언트를 만든다. publishable 키만 사용 |
| ESLint | `npm run lint` 통과. `eslint.config.mjs`의 `core-web-vitals` + TypeScript 규칙 준수 |

## 6. Workflow Standards

### 작업 완료 체크 순서 (코드 변경 후)
1. `npm run lint`
2. `npx tsc --noEmit` (타입 검증)
3. `npm run build` (라우트·데이터 변경이 빌드에 영향을 줄 때)
4. 브라우저 확인은 `npm start` 또는 `npm run dev` 후 `http://localhost:3000`

### 로드맵 작업 흐름 (docs/ROADMAP.md 기준)
```
ROADMAP 작업 계획 → 작업 파일 생성(/tasks/XXX-name.md) → 구현(계층 준수) → Playwright 테스트 → ROADMAP 체크 표시
```
- `/tasks/` 디렉터리는 **현재 존재하지 않는다.** 로드맵 작업 생성 시 만든다.
- API/비즈니스 로직 작업 문서에는 `## 테스트 체크리스트` 섹션을 **필수**로 포함한다.
- **각 Phase/Task 단계 완료 후 작업을 멈추고 사용자 지시를 기다린다** (ROADMAP 워크플로우 4번).

### 계층 구조
```
app/ → services/ → repositories/ → dto/
```
- 역방향 import 금지 (예: `services/`에서 `app/` import 금지, `dto/`에서 다른 계층 import 금지).

### 테스트 데이터
- 샘플 레시피는 `supabase/seed.sql`로 넣는다. 발행 10건, 재시도 가능하도록 `on conflict (slug) do nothing`.
- 재료 상세가 빈 레시피 등 제외 경로는 실제 DB에 테스트 행을 넣어 확인한다. 확인 후 테스트 행은 삭제한다.

## 7. Key File Interaction Standards

| 변경 대상 | 함께 확인/수정할 파일 |
|---|---|
| `dto/recipe.dto.ts` 타입 | `services/recipe-service.ts`, `repositories/recipe-repository.ts`, `components/recipes/*` |
| Supabase 컬럼 | `repositories/recipe-repository.ts`, `dto/recipe.dto.ts`, `supabase/seed.sql`, `docs/PRD.md` 6장 |
| `lib/recipe-options.ts` 옵션 | `services/recipe-service.ts`(파싱), `RecipeFilterPanel`, `dto/recipe.dto.ts` |
| `app/recipes/[slug]/page.tsx` | `generateStaticParams`, `dynamicParams`, `services` 호출 |
| `app/layout.tsx` 메타데이터 | `docs/PRD.md` 서비스명 |
| `components/ui/button.tsx` 변형 추가 | `components.json`과 충돌 없는지 확인, 사용처(`Header`, `RecipeFilterPanel`, `RecipeDetailView`) 영향 확인 |
| 로드맵 Task 완료 | `docs/ROADMAP.md`의 체크박스와 요구사항 추적표 |

## 8. AI Decision-making Standards

### 우선순위 판단 기준
1. **사용자의 명시적 지시** (이 파일, CLAUDE.md, AGENTS.md 포함)
2. **현재 코드 상태** (실제 파일이 존재하는지 Glob/Read로 확인)
3. **docs/ROADMAP.md 작업 명세**
4. **일반 Next.js·React 관례** (마지막)

### 의사결정 트리
```
요청 수신
├─ 현재 코드에 대상 파일이 있는가?
│   ├─ 예 → 해당 파일을 Read한 뒤 수정
│   └─ 아니오 → 로드맵 Task 명세가 있는가?
│       ├─ 예 → 명세의 파일 목록대로 생성 (계층 규칙 준수)
│       └─ 아니오 → 사용자에게 위치 확인 (추측 생성 금지)
├─ Next.js 16 API를 쓰는가?
│   └─ 예 → node_modules/next/dist/docs/ 확인 후 작성
├─ 외부 라이브러리 API를 쓰는가?
│   └─ 예 → Context7로 문서 확인
└─ UI 변경인가?
    └─ 예 → lint + 타입 체크 + 브라우저에서 확인 (Playwright는 로드맵 Task에서 요구 시)
```

### 모호한 경우 기본값
- **Ecommerce·쇼핑 등 레시피와 무관한 요청**: 프로젝트 도메인이 아니므로 적용하지 않고 사용자에게 확인한다.
- **새 페이지 요청**: `app/<path>/page.tsx`로 만들고, 로드맵이나 PRD 7장과 맞는지 먼저 확인한다.
- **스타일 충돌**: `globals.css` 토큰 > 컴포넌트 인라인 클래스 순으로 맞춘다.

## 9. Prohibited Actions

### 절대 금지 (MUST NOT)
- `.env*` 파일 커밋 또는 키 값 하드코딩 (`.gitignore`에 포함됨, `.env.example`만 커밋)
- `service_role` 키 사용 또는 노출
- `shrimp_data/` 커밋 (`.gitignore`에 포함됨)
- `node_modules/` 수정
- `next-env.d.ts`, `*.tsbuildinfo` 수정 또는 커밋
- `components/ui/*`를 shadcn 재생성 없이 구조적으로 변경
- `AGENTS.md`의 "This block is written and re-added by `next dev`" 블록 삭제 (삭제 시 `next dev`가 다시 추가함)
- `tailwind.config.*` 신규 생성 (Tailwind v4 CSS 방식)
- `yarn`, `pnpm` 명령 사용 (npm 전용)
- 존재하지 않는 파일·디렉터리를 존재한다고 가정하고 import
- `dangerouslySetInnerHTML` 사용
- 커밋 메시지·문서·주석을 영어로 작성 (변수/함수명 제외, CLAUDE.md 기준)

### 예시: 해도 되는 것 / 안 되는 것

| 작업 | 허용 | 금지 |
|---|---|---|
| 목록 필터 추가 | `services/recipe-service.ts`의 `filterRecipes`에 조건 추가 | `RecipeFilterPanel`이나 `page.tsx`에서 레시피를 직접 거르기 |
| DB 조회 추가 | `repositories/recipe-repository.ts`에 함수 추가 후 service에서 호출 | `app/`에서 Supabase 클라이언트 직접 사용 |
| 아이콘 | `import { ChefHat } from 'lucide-react'` | `import * as Icons from 'lucide-react'` |
| 색상 | `text-muted-foreground` | `text-gray-500` |
| 버튼 스타일 | `<Button variant="outline" size="lg">` | `components/ui/button.tsx`의 cva 문자열 직접 편집 |

## 10. 커밋 규칙 (CLAUDE.md 기준)
- 커밋 메시지는 **한국어**로 작성한다.
- 기존 커밋 형식을 따른다: `docs: ...`, `claude: ...`, `feat: ...` 접두사 사용.
- 커밋 전 `npm run lint`와 타입 체크를 통과시킨다.
