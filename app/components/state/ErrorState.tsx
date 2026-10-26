import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  // 사용자에게 보여줄 에러 안내 문구
  message: string;
  // 다시 시도 버튼 클릭 시 호출되는 함수 (없으면 버튼 생략)
  onRetry?: () => void;
}

// 데이터 로딩 실패 등 에러 상태를 보여주는 공통 UI (FR-06)
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center"
    >
      <h2 className="text-xl font-bold text-foreground">문제가 발생했습니다</h2>
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button type="button" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
