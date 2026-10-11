---
description: 변경사항을 유형별(feat/fix/refactor 등) 한국어 커밋 메시지로 커밋
argument-hint: [유형] [추가 설명]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
---

변경사항을 분석해 유형별 한국어 커밋 메시지를 만들고 커밋해줘. 인자: $ARGUMENTS

## 현재 상태
- git status: !`git status --short`
- 변경 통계: !`git diff HEAD --stat`
- 최근 커밋: !`git log --oneline -5`

## 순서
1. 위 상태와 `git diff HEAD`로 변경 내용을 파악한다.
2. 인자의 첫 단어가 아래 유형 중 하나면 그 유형을 쓰고, 없으면 변경 내용에 맞게 직접 고른다.
3. 변경이 서로 다른 유형(예: 기능 + 문서)에 걸쳐 있으면 논리적 단위로 나눠 여러 커밋을 제안한다.
4. 커밋 메시지 초안을 **먼저 사용자에게 보여주고 확인을 받은 뒤** 커밋한다.
5. 커밋할 파일은 이름을 지정해서 `git add`한다 (`git add -A`, `git add .` 금지).

## 커밋 유형
| 유형 | 용도 | 예시 |
|---|---|---|
| `feat` | 새 기능 추가 | `feat: 채팅 예시 질문 바로 전송 기능 추가` |
| `fix` | 버그 수정 | `fix: 한글 입력 중 Enter 중복 전송 수정` |
| `refactor` | 동작 변화 없는 구조 개선 | `refactor: 목업 응답을 lib로 분리` |
| `style` | 포맷/스타일 변경 (로직 무관) | `style: Header 들여쓰기 정리` |
| `ui` | UI/디자인/반응형/다크모드 변경 | `ui: 다크모드를 시스템 설정에 맞게 변경` |
| `docs` | 문서/주석 변경 | `docs: CLAUDE.md 명령어 설명 보완` |
| `test` | 테스트 추가/수정 | `test: Chat 컴포넌트 테스트 추가` |
| `perf` | 성능 개선 | `perf: 메시지 목록 렌더링 최적화` |
| `chore` | 빌드/설정/의존성/기타 | `chore: .gitignore에 playwright 폴더 추가` |
| `claude` | `.claude/` 커맨드/에이전트 설정 | `claude: code-reviewer 에이전트 추가` |

## 메시지 규칙
- 형식: `<유형>: <한국어 요약>` (제목 50자 내외, 마침표 없음, 현재형 "~추가", "~수정")
- 필요하면 빈 줄 후 본문에 **무엇을/왜** 바꿨는지 불릿으로 작성
- `.env`, 비밀키, `.claude/settings.local.json` 등은 커밋하지 않는다
- 이미 staged된 관련 없는 파일이 있으면 사용자에게 알리고 포함 여부를 묻는다
- hook 실패 시 `--no-verify`로 우회하지 말고 원인을 수정한다
- push는 요청받기 전에는 하지 않는다
