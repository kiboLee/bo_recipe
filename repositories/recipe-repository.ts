import 'server-only';

import type {
  Difficulty,
  RecipeCategory,
  RecipeDetailDto,
  RecipeIngredientDto,
  RecipeStepDto,
  RecipeSummaryDto,
} from '@/dto/recipe.dto';
import { getSupabaseClient } from '@/repositories/supabase-client';

// 테이블 이름과 발행 상태 값 (supabase/seed.sql과 테이블 생성 SQL 기준)
const TABLE_RECIPES = 'recipes';
const STATUS_PUBLISHED = '발행';
// 슬러그 형식: 영문 소문자와 하이픈만 허용 (형식이 틀리면 조회 없이 null)
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// 외부 이미지는 Supabase Storage 호스트만 허용한다 (next.config.ts remotePatterns와 맞춘다)
const ALLOWED_IMAGE_HOST_SUFFIX = '.supabase.co';
// 대표 이미지가 없거나 허용되지 않은 주소일 때 쓰는 기본 이미지
const PLACEHOLDER_IMAGE = '/recipe-placeholder.svg';

// 목록 카드에 필요한 컬럼 (재료 상세는 필수 값 검증에만 사용)
const LIST_COLUMNS =
  'id, slug, title, description, image_url, ingredient_tags, difficulty, cook_time_minutes, category, published_at, ingredient_items';

// 상세 화면에 필요한 전체 컬럼
const DETAIL_COLUMNS = `${LIST_COLUMNS}, steps`;

// Supabase 테이블 행 타입 (snake_case, DB 컬럼 기준). jsonb 컬럼은 검증 전이므로 unknown
interface RecipeRow {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  ingredient_tags: string[];
  difficulty: Difficulty;
  cook_time_minutes: number;
  category: RecipeCategory | null;
  published_at: string;
  ingredient_items: unknown;
  steps?: unknown;
}

// 레시피 저장소 인터페이스 (화면은 service를 통해서만 접근한다)
export interface RecipeRepository {
  // 발행 상태 레시피 목록 조회
  findPublishedRecipes(): Promise<RecipeSummaryDto[]>;
  // 슬러그로 발행 상태 레시피 단건 조회 (없으면 null)
  findPublishedRecipeBySlug(slug: string): Promise<RecipeDetailDto | null>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 로그에 남길 때 레시피를 특정할 수 있도록 ID와 슬러그를 함께 쓴다
function warn(row: RecipeRow, message: string): void {
  console.warn(`[recipe-repository] 레시피 id=${row.id} slug=${row.slug}: ${message}`);
}

// 재료 상세 항목 한 줄을 검증한다 (name, amount 필수)
function toIngredient(item: unknown): RecipeIngredientDto | null {
  if (!isRecord(item)) return null;
  const { name, amount } = item;
  if (typeof name !== 'string' || typeof amount !== 'string') return null;
  if (name.trim() === '' || amount.trim() === '') return null;
  return { name: name.trim(), amount: amount.trim() };
}

// 조리 순서 한 단계를 검증한다 (order는 1 이상의 정수, text 필수)
function toStep(item: unknown): RecipeStepDto | null {
  if (!isRecord(item)) return null;
  const { order, text } = item;
  if (typeof order !== 'number' || !Number.isInteger(order) || order < 1) return null;
  if (typeof text !== 'string' || text.trim() === '') return null;
  return { order, text: text.trim() };
}

// 재료 상세 목록을 검증한다. 잘못된 항목은 제외하고 로그를 남긴다
function parseIngredients(row: RecipeRow): RecipeIngredientDto[] {
  if (!Array.isArray(row.ingredient_items)) return [];
  const ingredients: RecipeIngredientDto[] = [];
  let invalidCount = 0;
  for (const item of row.ingredient_items) {
    const ingredient = toIngredient(item);
    if (ingredient) {
      ingredients.push(ingredient);
    } else {
      invalidCount += 1;
    }
  }
  if (invalidCount > 0) {
    warn(row, `재료 상세 잘못된 항목 ${invalidCount}건 제외`);
  }
  return ingredients;
}

// 조리 순서를 검증하고 order 기준으로 정렬한다. 잘못된 항목은 제외하고 로그를 남긴다
function parseSteps(row: RecipeRow): RecipeStepDto[] {
  if (!Array.isArray(row.steps)) return [];
  const steps: RecipeStepDto[] = [];
  let invalidCount = 0;
  for (const item of row.steps) {
    const step = toStep(item);
    if (step) {
      steps.push(step);
    } else {
      invalidCount += 1;
    }
  }
  steps.sort((a, b) => a.order - b.order);
  if (invalidCount > 0) {
    warn(row, `조리 순서 잘못된 항목 ${invalidCount}건 제외`);
  }
  if (steps.some((step, index) => step.order !== index + 1)) {
    warn(row, '조리 순서 번호가 1부터 연속하지 않음');
  }
  return steps;
}

// 대표 이미지 주소를 검증한다. 상대 경로(public 자산)나 허용 호스트의 https 주소만 사용한다
function toSafeImageUrl(row: RecipeRow): string {
  const url = row.image_url;
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && parsed.hostname.endsWith(ALLOWED_IMAGE_HOST_SUFFIX)) {
      return url;
    }
  } catch {
    // 잘못된 URL 형식은 아래에서 플레이스홀더로 대체한다
  }
  warn(row, '허용되지 않은 이미지 주소, 기본 이미지 사용');
  return PLACEHOLDER_IMAGE;
}

// 행 → 목록 DTO (DB의 null 값은 DTO의 선택 필드로 옮긴다)
function toSummary(row: RecipeRow): RecipeSummaryDto {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    thumbnailUrl: toSafeImageUrl(row),
    ingredientTags: row.ingredient_tags,
    difficulty: row.difficulty,
    cookingMinutes: row.cook_time_minutes,
    category: row.category ?? undefined,
    publishedAt: row.published_at,
  };
}

// 행 → 상세 DTO (목록 필드에 재료 상세와 조리 순서를 더한다)
function toDetail(row: RecipeRow, ingredients: RecipeIngredientDto[]): RecipeDetailDto {
  const summary = toSummary(row);
  return {
    id: summary.id,
    slug: summary.slug,
    title: summary.title,
    description: summary.description,
    thumbnailUrl: summary.thumbnailUrl,
    difficulty: summary.difficulty,
    cookingMinutes: summary.cookingMinutes,
    category: summary.category,
    publishedAt: summary.publishedAt,
    ingredients,
    steps: parseSteps(row),
  };
}

// Supabase 기반 구현. 발행 상태 필터는 쿼리와 RLS 정책에서 함께 걸리며,
// 재료 상세가 없는 레시피는 목록과 상세 모두에서 제외한다
export function createRecipeRepository(): RecipeRepository {
  return {
    async findPublishedRecipes() {
      const { data, error } = await getSupabaseClient()
        .from(TABLE_RECIPES)
        .select(LIST_COLUMNS)
        .eq('status', STATUS_PUBLISHED)
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(`레시피 목록 조회 실패: ${error.message}`);
      }

      const recipes: RecipeSummaryDto[] = [];
      for (const row of (data ?? []) as unknown as RecipeRow[]) {
        if (parseIngredients(row).length === 0) {
          warn(row, '재료 상세가 없어 목록에서 제외');
          continue;
        }
        recipes.push(toSummary(row));
      }
      return recipes;
    },

    async findPublishedRecipeBySlug(slug) {
      if (!SLUG_PATTERN.test(slug)) {
        return null;
      }

      const { data, error } = await getSupabaseClient()
        .from(TABLE_RECIPES)
        .select(DETAIL_COLUMNS)
        .eq('slug', slug)
        .eq('status', STATUS_PUBLISHED)
        .maybeSingle();

      if (error) {
        throw new Error(`레시피 상세 조회 실패: ${error.message}`);
      }
      if (!data) {
        return null;
      }

      const row = data as unknown as RecipeRow;
      const ingredients = parseIngredients(row);
      if (ingredients.length === 0) {
        warn(row, '재료 상세가 없어 상세에서 제외');
        return null;
      }
      return toDetail(row, ingredients);
    },
  };
}
