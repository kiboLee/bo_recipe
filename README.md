# 요리 레시피

냉장고 속 재료로 만들 수 있는 1인분 레시피를 초보자도 따라 할 수 있게 제공하는 웹 서비스입니다.
재료를 골라 레시피를 찾고, 상세 페이지에서 재료와 조리 순서를 확인하고, PDF로 저장할 수 있습니다.

## 주요 기능

- **레시피 목록**: 발행된 레시피를 카드로 보여주고, 선택한 재료를 모두 포함하는 레시피만 걸러냅니다 (AND 조건). 카테고리·난이도 필터와 최신순·조리 시간순 정렬을 지원합니다.
- **레시피 상세**: 1인분 기준 메타 정보, 재료 목록, 번호 순서대로 된 조리 순서를 보여줍니다.
- **PDF 다운로드** (예정): 한글이 깨지지 않는 `{슬러그}.pdf` 저장
- **콘텐츠 관리**: Supabase `recipes` 테이블에서 레시피를 관리하고, 발행 상태인 항목만 노출합니다. ISR로 주기적으로 반영합니다.
- **반응형 및 다크모드**: 모바일 360px 이상 지원, 라이트/다크 테마 전환

## 기술 스택

- Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- Tailwind CSS v4, shadcn/ui, lucide-react
- Supabase (Postgres, `@supabase/supabase-js`)

## 시작하기

```bash
npm install
cp .env.example .env.local   # Supabase 값 입력
npm run dev                  # http://localhost:3000
```

### 환경 변수

| 이름 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable 키 (RLS로 보호된 공개 키) |

`service_role` 키는 프로젝트 코드에 넣지 않습니다. `.env*` 파일은 Git에 올리지 않습니다.

### 자주 쓰는 명령어

```bash
npm run build   # 프로덕션 빌드
npm start       # 프로덕션 서버 (빌드 후 실행)
npm run lint    # ESLint 검사
```

## 디렉터리 구조

```
app/            # 라우트와 화면 (page, layout, 404, 로딩·에러 처리)
components/     # 레시피 카드, 필터 패널, 상세 화면 등 화면 컴포넌트
services/       # 유스케이스: 목록 필터·정렬, 상세 조회
repositories/   # Supabase 호출과 행 → DTO 변환 (서버 전용)
dto/            # 응답 타입과 열거 타입
lib/            # 환경 변수 검증, 옵션 상수
supabase/       # 샘플 데이터 SQL (seed.sql)
docs/           # PRD, 개발 로드맵
```

계층 규칙은 `app/ → services/ → repositories/ → dto/`이며, 역방향 import는 하지 않습니다.

## 문서

- [요리 레시피 PRD](docs/PRD.md): 요구사항, 데이터 모델, 화면 구성
- [개발 로드맵](docs/ROADMAP.md): 단계별 작업과 체크리스트
