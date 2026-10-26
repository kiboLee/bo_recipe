import type {
  RecipeDetailDto,
  RecipeListQuery,
  RecipeSortOption,
  RecipeSummaryDto,
} from '@/dto/recipe.dto';
import {
  isDifficulty,
  isRecipeCategory,
  isRecipeSortOption,
} from '@/lib/recipe-options';
import {
  createRecipeRepository,
  type RecipeRepository,
} from '@/repositories/recipe-repository';

// 화면(app/)이 호출하는 유스케이스 인터페이스
export interface RecipeService {
  // 목록 조회 (재료 AND 필터, 카테고리·난이도, 정렬 적용)
  listRecipes(query: RecipeListQuery): Promise<RecipeSummaryDto[]>;
  // 필터 선택지로 쓸 재료 태그 목록 (중복 제거, 가나다순)
  listIngredientTags(): Promise<string[]>;
  // 슬러그 단건 조회 (없으면 null, 상세 페이지에서 notFound() 처리)
  getRecipeBySlug(slug: string): Promise<RecipeDetailDto | null>;
}

// 선택한 재료를 모두 포함하는 레시피만 남기고(AND), 카테고리·난이도 단일 조건을 적용한다
export function filterRecipes(
  recipes: RecipeSummaryDto[],
  query: RecipeListQuery
): RecipeSummaryDto[] {
  return recipes.filter(recipe => {
    if (query.ingredients?.length) {
      const hasAllIngredients = query.ingredients.every(tag =>
        recipe.ingredientTags.includes(tag)
      );
      if (!hasAllIngredients) return false;
    }
    if (query.category && recipe.category !== query.category) return false;
    if (query.difficulty && recipe.difficulty !== query.difficulty) return false;
    return true;
  });
}

// 정렬: 기본은 발행일 내림차순(최신순), 조리 시간순은 오름차순
export function sortRecipes(
  recipes: RecipeSummaryDto[],
  sort: RecipeSortOption = 'publishedAt-desc'
): RecipeSummaryDto[] {
  const sorted = [...recipes];
  if (sort === 'cookingMinutes-asc') {
    return sorted.sort((a, b) => a.cookingMinutes - b.cookingMinutes);
  }
  // ISO 날짜 문자열은 사전순 비교가 날짜순과 같다
  return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// URL 쿼리 값(searchParams)을 목록 쿼리 타입으로 바꾼다. 잘못된 값은 무시한다
export function parseRecipeListQuery(
  params: Record<string, string | string[] | undefined>
): RecipeListQuery {
  const readFirst = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const rawIngredients = readFirst(params.ingredients) ?? '';
  const ingredients = [
    ...new Set(
      rawIngredients
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    ),
  ];

  const category = readFirst(params.category);
  const difficulty = readFirst(params.difficulty);
  const sort = readFirst(params.sort);

  return {
    ingredients: ingredients.length > 0 ? ingredients : undefined,
    category: isRecipeCategory(category) ? category : undefined,
    difficulty: isDifficulty(difficulty) ? difficulty : undefined,
    sort: isRecipeSortOption(sort) ? sort : undefined,
  };
}

// repository를 주입받는 구현. 필터와 정렬은 순수 함수로 분리해 두었다
export function createRecipeService(repository: RecipeRepository): RecipeService {
  return {
    async listRecipes(query) {
      const recipes = await repository.findPublishedRecipes();
      return sortRecipes(filterRecipes(recipes, query), query.sort);
    },
    async listIngredientTags() {
      const recipes = await repository.findPublishedRecipes();
      const tags = new Set(recipes.flatMap(recipe => recipe.ingredientTags));
      return [...tags].sort((a, b) => a.localeCompare(b, 'ko'));
    },
    async getRecipeBySlug(slug) {
      return repository.findPublishedRecipeBySlug(slug);
    },
  };
}

// 앱 전체에서 공유하는 서비스 인스턴스 (Phase 3에서 repository 구현만 교체한다)
export const recipeService = createRecipeService(createRecipeRepository());
