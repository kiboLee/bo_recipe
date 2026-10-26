import { RecipeListSkeleton } from './components/state/RecipeListSkeleton';

// 라우트 전환 중 표시되는 로딩 화면 (목록 카드 스켈레톤)
export default function Loading() {
  return <RecipeListSkeleton />;
}
