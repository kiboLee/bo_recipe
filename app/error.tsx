'use client';

import { useEffect } from 'react';
import { ErrorState } from './components/state/ErrorState';

interface ErrorPageProps {
  // 렌더링 중 발생한 에러 객체
  error: Error & { digest?: string };
  // 에러 경계를 다시 렌더링하는 함수
  reset: () => void;
}

// 라우트 세그먼트 에러 화면 (공통 ErrorState 사용)
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // 서버 로그 확인을 위해 에러를 콘솔에 남긴다
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message="레시피 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
      onRetry={() => reset()}
    />
  );
}
