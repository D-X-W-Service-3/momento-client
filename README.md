# Momento Client

Momento 프론트엔드 레포지토리입니다. 아래 폴더 구조와 컨벤션을 지켜주세요.

## 🛠 Tech Stack

| Category        | Stack                         |
| --------------- | ----------------------------- |
| Framework       | React 19 + TypeScript         |
| Build           | Vite 7                        |
| Styling         | Tailwind CSS v4 (디자인 토큰) |
| Routing         | React Router v7               |
| 서버 상태       | TanStack Query (React Query)  |
| 클라이언트 상태 | Zustand                       |
| HTTP            | Axios                         |
| 애니메이션      | Framer Motion                 |
| 폰트            | Pretendard                    |
| PWA             | vite-plugin-pwa               |
| Lint / Format   | ESLint + Prettier + Husky     |

## 🚀 Getting Started

```bash
npm install       # 의존성 설치 (postinstall 로 husky 세팅)
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 타입체크 + 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint
npm run format    # Prettier 전체 포맷
npm run typecheck # 타입 검사만
```

> 환경 변수가 필요해지면 루트에 `.env` 를 만들고 `VITE_` 접두사로 추가하세요.
> (Vite 는 `VITE_` 로 시작하는 변수만 클라이언트에 노출합니다.)

## 📁 폴더 구조

```
src/
├── apis/          # 백엔드 API 호출 함수 (도메인별 파일: auth.ts, users.ts ...)
├── assets/        # 이미지, 폰트 등 정적 리소스
├── components/
│   ├── common/    # 재사용 UI 컴포넌트 (Button, Input, Modal ...)
│   └── layout/    # 레이아웃 컴포넌트 (헤더/탭바 등 페이지 골격)
├── constants/     # 상수
├── hooks/         # 커스텀 훅
├── lib/           # 외부 라이브러리 설정/인스턴스 (axios 인스턴스 등)
├── pages/         # 라우트 단위 화면 (도메인별 폴더로 묶어도 OK)
├── routes/        # 라우팅 관련 (라우트 가드 등)
├── stores/        # 전역 상태 (Zustand 스토어)
├── styles/        # 전역 스타일 + 디자인 토큰
│   ├── index.css  # Tailwind import + @theme 디자인 토큰 (SSOT)
│   └── tokens/    # JS에서 쓰는 색/타이포 토큰
├── types/         # 공통 타입 정의
├── utils/         # 순수 유틸 함수
├── App.tsx        # 라우터 정의
└── main.tsx       # 앱 엔트리
```

> 각 폴더의 `.gitkeep` 은 빈 폴더를 git 에 올리기 위한 파일입니다. 실제 파일이 생기면 지워도 됩니다.

### 레이어 원칙

- `pages` 는 화면 조합만 담당하고, 로직은 `hooks` / `utils` 로, 서버 통신은 `apis` 로, 전역 상태는 `stores` 로 내립니다.
- **서버 상태**는 TanStack Query, **클라이언트/화면 상태**는 Zustand 로 분리합니다.

## 🎨 디자인 토큰

색상/타이포/간격은 `src/styles/index.css` 의 `@theme` 이 단일 진실 공급원(SSOT)입니다.
Figma 확정 시 이 값들을 맞춰주세요. (현재 값은 임시 placeholder)

```tsx
// 99%는 Tailwind 클래스로
<button className="bg-primary text-text-on-primary text-body-md">확인</button>;

// JS에서 색을 직접 써야 할 때만 (Framer Motion 등)
import { colors } from '@/styles/tokens';
```

- Hex 값 직접 사용은 지양하고, 토큰(클래스)을 우선 사용합니다.

## 🔗 Path Alias

`@/*` 로 `src/*` 를 참조합니다.

```ts
import HomePage from '@/pages/HomePage';
```

## 📝 Code Convention

- 들여쓰기 2 spaces / 세미콜론 사용 / 작은따옴표(`'`)
- 컴포넌트: 함수형, **PascalCase**
- 파일명: 컴포넌트는 PascalCase, 그 외 camelCase
- 커밋 전 Husky(pre-commit)가 `npm run lint` 를 실행합니다.
- VS Code 는 **Format on Save** 활성화 권장.

## 🌿 Branch & Commit

- 작업 브랜치는 `develop` 에서 분기 → `develop` 으로 PR 후 머지 (`main` 은 배포용).
- 브랜치명 예시: `feat/login`, `fix/home-scroll`, `chore/eslint`
- 이슈/PR 은 `.github` 의 템플릿을 사용합니다.

### 커밋 메시지 컨벤션

`type: 설명` 형식으로 작성합니다. (예: `feat: 홈 화면 레이아웃 추가`)

| Type       | 설명                                           |
| ---------- | ---------------------------------------------- |
| `feat`     | 새로운 기능 추가                               |
| `fix`      | 버그 수정                                      |
| `docs`     | 문서 수정                                      |
| `style`    | 코드 스타일 변경 (포매팅, 세미콜론 등, 로직 X) |
| `design`   | 사용자 UI 디자인 변경 (CSS 등)                 |
| `refactor` | 리팩토링 (기능 변화 없는 코드 개선)            |
| `test`     | 테스트 코드 추가/수정                          |
| `build`    | 빌드 관련 파일 수정                            |
| `ci`       | CI 설정 파일 수정                              |
| `perf`     | 성능 개선                                      |
| `chore`    | 설정 변경 등 자잘한 작업                       |
| `rename`   | 파일/폴더명 변경만 한 경우                     |
| `remove`   | 파일 삭제만 한 경우                            |

> 참고: [커밋 메시지 컨벤션 가이드](https://sungwookoo.tistory.com/1)
