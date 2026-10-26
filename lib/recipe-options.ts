import type {
  Difficulty,
  RecipeCategory,
  RecipeSortOption,
} from '@/dto/recipe.dto';

// 카테고리 선택지 (PRD 6장 Select 옵션)
export const RECIPE_CATEGORIES: readonly RecipeCategory[] = ['한식', '양식', '간단식'];

// 난이도 선택지 (PRD 6장 Select 옵션)
export const RECIPE_DIFFICULTIES: readonly Difficulty[] = ['쉬움', '보통'];

// 정렬 선택지 (첫 항목이 기본값)
export const RECIPE_SORT_OPTIONS: readonly { value: RecipeSortOption; label: string }[] = [
  { value: 'publishedAt-desc', label: '최신순' },
  { value: 'cookingMinutes-asc', label: '조리 시간순' },
];

// 문자열이 카테고리 값인지 확인한다 (URL 쿼리 검증용)
export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return RECIPE_CATEGORIES.some(category => category === value);
}

// 문자열이 난이도 값인지 확인한다 (URL 쿼리 검증용)
export function isDifficulty(value: unknown): value is Difficulty {
  return RECIPE_DIFFICULTIES.some(difficulty => difficulty === value);
}

// 문자열이 정렬 옵션 값인지 확인한다 (URL 쿼리 검증용)
export function isRecipeSortOption(value: unknown): value is RecipeSortOption {
  return RECIPE_SORT_OPTIONS.some(option => option.value === value);
}
