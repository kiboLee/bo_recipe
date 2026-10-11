# Ecommerce AI Agent

자연어로 쇼핑을 도와주는 AI Agent 서비스입니다. 사용자가 "내 주문 배송 현황 알려줘", "무선 이어폰 추천해줘"처럼 질문하면 주문, 배송, 상품, 고객지원 관련 답변을 채팅 형태로 제공합니다.

> 현재는 UI 프로토타입 단계이며, 응답은 `lib/mockResponses.ts`의 목 데이터를 사용합니다.

## 주요 기능

- 메인 화면 예시 질문 제공 (`lib/constants.ts`의 `exampleQuestions`)
- 채팅 인터페이스 (`app/components/Chat.tsx`)
- 헤더 내비게이션 및 퀵메뉴 (`app/components/Header.tsx`, `app/components/QuickMenu.tsx`)
- 라이트/다크 모드 지원 (`dark:` 접두사)

## 기술 스택

- **Next.js 16.3.8** (App Router), **React 19.2.8**, **TypeScript 5**
- **Tailwind CSS v4**, **shadcn/ui**, **@base-ui/react**
- **lucide-react** (아이콘), **class-variance-authority**

## 시작하기

### 요구 사항

- Node.js 20 이상
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev
```

### 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (파일 변경 시 자동 새로고침) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 (빌드 필요) |
| `npm run lint` | ESLint 검사 |

## 프로젝트 구조

```
.
├── app/                  # App Router (layout, page, 컴포넌트, 전역 스타일)
│   └── components/       # Chat, Header, HomeClient, QuickMenu
├── components/ui/        # shadcn/ui 컴포넌트
├── lib/                  # 상수, 목 응답, 유틸리티
├── public/               # 정적 자산
└── docs/                 # 문서 (PRD 등)
```

## 문서

- [요리 레시피 PRD](docs/PRD.md): Notion을 CMS로 활용하는 요리 레시피 웹 프로젝트 기획서
