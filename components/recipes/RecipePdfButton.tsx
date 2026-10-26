'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface RecipePdfButtonProps {
  // PDF를 받을 레시피 슬러그 (파일명과 요청 경로에 쓴다)
  slug: string;
}

// 생성 실패 시 보여 줄 안내 문구
const ERROR_MESSAGE = 'PDF를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.';

// 상세 화면의 PDF 다운로드 버튼. 생성 중에는 비활성화해 중복 요청을 막는다
export function RecipePdfButton({ slug }: RecipePdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  // 상태 갱신은 다음 렌더링에 반영되므로, 연속 클릭을 막는 가드는 ref로 즉시 판단한다
  const isRequestingRef = useRef(false);

  async function handleDownload() {
    if (isRequestingRef.current) return;
    isRequestingRef.current = true;

    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(`/api/recipes/${slug}/pdf`);
      if (!response.ok) {
        throw new Error(`PDF 요청 실패: ${response.status}`);
      }

      // 받은 바이트를 임시 주소로 바꿔 파일 저장을 띄운다
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slug}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[recipe-pdf-button] 다운로드 실패', error);
      setHasError(true);
    } finally {
      isRequestingRef.current = false;
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleDownload}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'PDF 생성 중...' : 'PDF 다운로드'}
      </Button>
      {hasError && (
        <p role="alert" className="text-sm text-destructive">
          {ERROR_MESSAGE}
        </p>
      )}
    </div>
  );
}
