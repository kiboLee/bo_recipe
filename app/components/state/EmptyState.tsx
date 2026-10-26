import type { ReactNode } from 'react';

interface EmptyStateProps {
  // 빈 상태 제목
  title: string;
  // 빈 상태 설명 문구
  description: string;
  // 하단에 표시할 동작 (예: 필터 초기화 버튼), 없으면 생략
  action?: ReactNode;
}

// 결과가 없을 때 보여주는 빈 상태 UI (FR-06)
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
