/**
 * 레시피 응답 DTO 및 열거 타입 정의
 *
 * PRD 6장 데이터 모델(Supabase recipes 테이블)과 화면 데이터의 대응:
 * | 컬럼                 | 화면 데이터 대응                                      |
 * |----------------------|------------------------------------------------------|
 * | title                | RecipeSummaryDto.title (목록·상세 제목, PDF 제목)     |
 * | slug                 | RecipeSummaryDto.slug (URL 식별자, PDF 파일명)        |
 * | description          | RecipeSummaryDto.description (카드 한 줄 설명)        |
 * | image_url            | RecipeSummaryDto.thumbnailUrl (카드·상세·PDF)         |
 * | ingredient_tags      | RecipeSummaryDto.ingredientTags (목록 재료 필터)      |
 * | ingredient_items     | RecipeDetailDto.ingredients (상세 재료 목록, 1인분)   |
 * | difficulty           | RecipeSummaryDto.difficulty (카드·목록 필터)          |
 * | cook_time_minutes    | RecipeSummaryDto.cookingMinutes (카드·정렬)           |
 * | category             | RecipeSummaryDto.category (목록 필터, 상세 메타)      |
 * | status               | DTO 필드 없음, 발행 여부 필터에만 사용 (RecipeStatus) |
 * | published_at         | RecipeSummaryDto.publishedAt (기본 정렬 기준)         |
 * | steps                | RecipeDetailDto.steps (조리 순서, order 기준)         |
 *
 * 행 → DTO 변환(snake_case → camelCase)은 repositories/recipe-repository.ts에서 한다.
 * 레시피 ID(bigint)는 RecipeSummaryDto.id에 문자열로 매핑한다.
 */

// 난이도 (Select: 쉬움 / 보통)
export type Difficulty = '쉬움' | '보통';

// 카테고리 (Select: 한식 / 양식 / 간단식 등, PRD 6장 기준)
export type RecipeCategory = '한식' | '양식' | '간단식';

// 발행 상태 (Status: 초안 / 발행). 발행 필터에만 사용하며 DTO 필드로는 노출하지 않는다
export type RecipeStatus = '초안' | '발행';

// 목록 정렬 옵션 (발행일 내림차순 기본, 조리 시간 오름차순 선택)
export type RecipeSortOption = 'publishedAt-desc' | 'cookingMinutes-asc';

// 상세 재료 한 줄 (재료 상세 Text의 줄 단위 항목)
export interface RecipeIngredientDto {
  // 재료명
  name: string;
  // 1인분 기준 분량 (예: "1개", "50g")
  amount: string;
}

// 조리 순서 한 단계 (페이지 본문의 번호 목록 항목)
export interface RecipeStepDto {
  // 단계 번호 (1부터 시작)
  order: number;
  // 단계 설명 문장
  text: string;
  // 단계에 붙은 이미지 URL (없으면 생략)
  imageUrl?: string;
  // 이미지 대체 텍스트 (캡션 또는 레시피 제목 기반 기본값)
  imageAlt?: string;
}

// 목록 카드 및 목록 응답 단위
export interface RecipeSummaryDto {
  // 레시피 ID (DB bigint를 문자열로 변환)
  id: string;
  // URL 식별자 (영문 소문자, 하이픈)
  slug: string;
  // 레시피 제목
  title: string;
  // 한 줄 소개 (선택 속성이므로 없을 수 있음)
  description?: string;
  // 대표 이미지 URL (DB에 값이 없으면 빈 값 허용)
  thumbnailUrl?: string;
  // 재료 태그 (Multi-select 옵션 이름 목록, 재료 필터에 사용)
  ingredientTags: string[];
  // 난이도
  difficulty: Difficulty;
  // 조리 시간 (분)
  cookingMinutes: number;
  // 카테고리 (선택 속성이므로 없을 수 있음)
  category?: RecipeCategory;
  // 발행일 (ISO 8601 날짜 문자열)
  publishedAt: string;
}

// 상세 응답 (목록 항목 + 1인분 재료 + 조리 순서)
export interface RecipeDetailDto extends Omit<RecipeSummaryDto, 'ingredientTags'> {
  // 재료 상세 (1인분 기준, 줄 단위 분리 결과)
  ingredients: RecipeIngredientDto[];
  // 조리 순서 (본문 번호 목록 기준)
  steps: RecipeStepDto[];
}

// 목록 조회 쿼리 (searchParams에서 파싱된 결과)
export interface RecipeListQuery {
  // 선택한 재료 태그 목록 (모두 포함하는 레시피만, AND 조건)
  ingredients?: string[];
  // 카테고리 단일 조건
  category?: RecipeCategory;
  // 난이도 단일 조건
  difficulty?: Difficulty;
  // 정렬 옵션 (생략 시 발행일 내림차순)
  sort?: RecipeSortOption;
}
