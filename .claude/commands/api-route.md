---
description: Route Handler + Service + DTO 계층 구조로 API 생성
argument-hint: <경로> <설명>
---

다음 요청에 따라 API를 생성해줘: $ARGUMENTS

## 작업 순서
1. `node_modules/next/dist/docs/`에서 Route Handler 가이드를 먼저 확인한다.
2. 아래 레이어로 분리해 생성한다.
   - Controller: `app/api/<경로>/route.ts` (요청 파싱, 응답 변환만 담당)
   - Service: `lib/services/<name>Service.ts` (비즈니스 로직)
   - DTO: `lib/types/<name>.ts` (요청/응답 타입)

## 규칙
- 레이어드 아키텍처 (Controller → Service → Repository) 및 DTO 사용
- 에러 핸들링 필수 (try/catch, 적절한 HTTP 상태 코드)
- 응답 형식 통일: `{ success: boolean, data?: T, error?: string }`
- DB 접근이 있으면 트랜잭션 처리
- 들여쓰기 2칸, camelCase, 주석은 한국어
- 완료 후 `npx tsc --noEmit`으로 타입을 검사한다
