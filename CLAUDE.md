# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수/함수명**: 영어 (코드 표준 준수)

## 프로젝트 개요

**ecommerce-ai-agent**는 Next.js 16.3.8, React 19.2.8, TypeScript 5로 구축된 애플리케이션입니다. App Router 패턴과 Tailwind CSS v4를 사용합니다.

## 개발 명령어

```bash
# 개발 서버 실행 (파일 변경 시 자동 새로고침)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작 (빌드 필수)
npm start

# ESLint로 코드 검사
npm run lint
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 프로젝트 구조

```
.
├── app/                      # App Router 디렉터리 (Next.js 13+)
│   ├── layout.tsx           # 루트 레이아웃 컴포넌트
│   ├── page.tsx             # 홈 페이지
│   └── globals.css          # 전역 Tailwind 스타일
├── public/                  # 정적 자산 (이미지, SVG)
├── node_modules/            # 의존성
├── eslint.config.mjs        # ESLint 설정
├── next.config.ts           # Next.js 설정
├── postcss.config.mjs       # PostCSS/Tailwind 설정
├── tsconfig.json            # TypeScript 설정
└── package.json             # 프로젝트 의존성 & 스크립트
```

## 핵심 의존성

- **Next.js 16.3.8**: App Router를 지원하는 React 프레임워크
- **React 19.2.8**: UI 라이브러리 (클라이언트/서버 컴포넌트)
- **TypeScript 5**: 타입 안정성
- **Tailwind CSS v4**: 유틸리티 우선 CSS 프레임워크 (PostCSS 통합)
- **shadcn/ui**: 사전 제작된 접근성 있는 UI 컴포넌트
- **@base-ui/react**: 헤드리스 UI 라이브러리
- **lucide-react**: 아이콘 라이브러리 (1,500+ SVG 아이콘)
- **class-variance-authority**: 합성 가능한 컴포넌트 스타일링

## 아키텍처 참고사항

### App Router
이 프로젝트는 Next.js App Router (`app/` 디렉터리)를 사용합니다:
- 기본적으로 Server Components
- `'use client'` 지시문으로 Client Components 표시
- 파일 기반 라우팅 (page.tsx 파일이 경로가 됨)
- 공유 레이아웃 계층구조 (layout.tsx 파일)

### 스타일링
- **Tailwind CSS v4** (PostCSS 포함)
- 밝은 모드와 어두운 모드 지원 (`dark:` 접두사)
- 기본 폰트: next/font의 Geist Sans와 Geist Mono

### 설정
- **경로 별칭**: `@/*` → 프로젝트 루트
- **TypeScript strict 모드**: 활성화
- **모듈 해석**: Bundler (ESM 우선)
- **ESLint**: Flat config 형식 (core-web-vitals + TypeScript)

## 주의사항

### Next.js 16 주요 변경사항
이 버전은 이전 Next.js 버전과 호환되지 않는 변경사항이 있습니다. 새로운 기능을 구현하기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 참고하세요.
