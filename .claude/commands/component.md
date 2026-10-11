---
description: 새 React 컴포넌트를 프로젝트 컨벤션에 맞게 생성
argument-hint: <컴포넌트명> <설명>
---

다음 요청에 따라 컴포넌트를 생성해줘: $ARGUMENTS

## 작업 순서
1. 작성 전 `node_modules/next/dist/docs/`에서 관련 가이드를 확인한다 (Next.js 16 변경사항 대응).
2. `app/components/Chat.tsx`, `Header.tsx`의 기존 패턴을 참고한다.
3. `app/components/<PascalCase>.tsx`에 생성한다.

## 규칙
- 들여쓰기 2칸, 변수/함수명 camelCase, 컴포넌트명 PascalCase
- 주석은 한국어로 작성
- 상태/이벤트가 필요한 경우에만 `'use client'` 사용 (기본은 Server Component)
- Props는 `interface`로 정의
- UI는 `components/ui/*`(shadcn), `cn()`(`lib/utils.ts`), `lucide-react`를 재사용
- Tailwind v4 사용, 다크모드(`dark:`) 지원
- 완료 후 `npm run lint`로 검사하고 결과를 요약한다
