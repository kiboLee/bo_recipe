import { Card, CardContent } from '@/components/ui/card';

// 목록 카드 자리 표시 개수 (3열 기준 2줄)
const SKELETON_COUNT = 6;

// 레시피 목록 로딩 중 카드 자리를 보여주는 스켈레톤 (FR-06)
export function RecipeListSkeleton() {
  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
      aria-live="polite"
    >
      {/* 스크린리더 안내 */}
      <p className="sr-only">레시피 목록을 불러오는 중입니다</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Card key={index} className="animate-pulse">
            {/* 대표 이미지 자리 */}
            <div className="aspect-video w-full rounded-t-xl bg-muted" />
            <CardContent className="space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
