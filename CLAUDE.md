# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 프로젝트 가이드입니다.

## 프로젝트 개요

Momento 프론트엔드. **모바일 PWA** 웹앱입니다.

- **스택**: React 19 + TypeScript, Vite 7, Tailwind CSS v4, React Router v7, TanStack Query, Zustand, Axios
- **패키지 매니저**: npm

## 명령어

```bash
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 타입체크 + 프로덕션 빌드
npm run lint       # ESLint
npm run format     # Prettier 전체 포맷
npm run typecheck  # 타입 검사만
```

작업을 마치기 전 관련 파일에 대해 `npm run lint` 와 `npm run typecheck` 가 통과하는지 확인하세요.

## 폴더 구조

```
src/
├── apis/          # 백엔드 API 호출 함수 (도메인별 파일)
├── components/
│   ├── common/    # 재사용 UI 컴포넌트
│   └── layout/    # 레이아웃 컴포넌트
├── constants/     # 상수
├── hooks/         # 커스텀 훅
├── lib/           # 외부 라이브러리 설정/인스턴스
├── pages/         # 라우트 단위 화면
├── routes/        # 라우팅 (라우트 가드 등)
├── stores/        # Zustand 전역 상태
├── styles/        # 전역 스타일 + 디자인 토큰 (index.css @theme)
├── types/         # 공통 타입
└── utils/         # 순수 유틸 함수
```

### 레이어 원칙

- `pages` 는 화면 조합만 담당하고, 로직은 `hooks`/`utils`, 서버 통신은 `apis`, 전역 상태는 `stores` 로 내립니다.
- **서버 상태**는 TanStack Query, **클라이언트/화면 상태**는 Zustand 로 분리합니다.

## 코드 컨벤션

- 들여쓰기 2 spaces, 세미콜론 사용, 작은따옴표(`'`)
- 컴포넌트: 함수형, PascalCase / 그 외 파일은 camelCase
- import 경로는 `@/*` alias 사용 (`@/components/...`)
- 색상/타이포/간격은 **디자인 토큰**(Tailwind 클래스, `src/styles/index.css` 의 `@theme`)을 사용하고, **hex 값 직접 사용은 지양**합니다.
- 주석은 한국어로 작성해도 됩니다 (기존 코드 스타일을 따르세요).

## Git

- 작업 브랜치는 `develop` 에서 분기 → `develop` 으로 PR, `main` 은 배포용.
- 커밋 메시지: `type: 설명` 형식. type 종류: `feat` `fix` `docs` `style` `design` `refactor` `test` `build` `ci` `perf` `chore` `rename` `remove`
- **사용자가 명시적으로 요청하지 않으면 커밋/푸시하지 마세요.** (팀원이 직접 커밋합니다)
