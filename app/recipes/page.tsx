import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeFilterPanel } from '@/components/recipes/RecipeFilterPanel';
import { EmptyState } from '@/app/components/state/EmptyState';
import { parseRecipeListQuery, recipeService } from '@/services/recipe-service';
import type { Metadata } from 'next';

// 목록 메타데이터: 필터 쿼리가 붙은 주소도 기본 목록으로 색인하도록 canonical을 고정한다
export const metadata: Metadata = {
  title: '레시피 목록',
  description: '냉장고 속 재료로 만드는 1인분 레시피 목록',
  alternates: { canonical: '/recipes' },
};

// 첫 화면에 보이는 카드 수 (데스크톱 3열 기준 한 줄)
const PRIORITY_CARD_COUNT = 3;

interface RecipesPageProps {
  // 현재 URL의 쿼리 문자열 (Next 16에서는 Promise)
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 레시피 목록 페이지: 필터는 URL 쿼리로 관리하고, 데이터는 services를 통해서만 가져온다
export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const query = parseRecipeListQuery(params);

  const [recipes, ingredientTags] = await Promise.all([
    recipeService.listRecipes(query),
    recipeService.listIngredientTags(),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">레시피 목록</h1>

      <RecipeFilterPanel availableIngredients={ingredientTags} query={query} />

      {recipes.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} priority={index < PRIORITY_CARD_COUNT} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="조건에 맞는 레시피가 없습니다"
          description="선택한 재료나 필터를 줄여 보세요."
          action={
            <Link href="/recipes" className={buttonVariants({ variant: 'outline' })}>
              필터 초기화
            </Link>
          }
        />
      )}
    </div>
  );
}
