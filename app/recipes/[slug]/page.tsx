import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RecipeDetailView } from '@/components/recipes/RecipeDetailView';
import { DEFAULT_OG_IMAGE_PATH, SITE_URL } from '@/lib/site';
import { recipeService } from '@/services/recipe-service';

interface RecipePageProps {
  // 동적 라우트 params는 Promise이므로 반드시 await 한다 (Next.js 16)
  params: Promise<{ slug: string }>;
}

// 빌드 때 생성된 슬러그 외의 경로는 렌더링하지 않고 바로 404를 반환한다 (상태 코드 404 보장)
export const dynamicParams = false;

// ISR 재검증 주기 (초). route segment config는 정적 리터럴이어야 해서 환경 변수로 바꿀 수 없다
export const revalidate = 600;

// 발행된 레시피 슬러그를 빌드 시 미리 생성한다
// 빌드 시 Supabase 조회가 실패하면 빌드도 실패한다. 조회가 실패한 채로 배포되면 모든 상세가 404가 되기 때문이다
export async function generateStaticParams() {
  const recipes = await recipeService.listRecipes({});
  return recipes.map(recipe => ({ slug: recipe.slug }));
}

// 상세 메타데이터: 제목, 설명, canonical, Open Graph 이미지(대체 텍스트 포함)를 레시피 데이터로 채운다
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await recipeService.getRecipeBySlug(slug);

  if (!recipe) {
    return { title: '레시피를 찾을 수 없습니다', robots: { index: false, follow: false } };
  }

  const description = recipe.description ?? `${recipe.title} 1인분 레시피`;
  const imageUrl = new URL(recipe.thumbnailUrl ?? DEFAULT_OG_IMAGE_PATH, SITE_URL).toString();

  return {
    title: recipe.title,
    description,
    alternates: { canonical: `/recipes/${slug}` },
    openGraph: {
      title: recipe.title,
      description,
      url: `/recipes/${slug}`,
      type: 'article',
      images: [{ url: imageUrl, alt: `${recipe.title} 대표 이미지` }],
    },
  };
}

// 레시피 상세 페이지: 조회는 services를 통해서만 하고, 없으면 404로 처리한다
export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await recipeService.getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailView recipe={recipe} />;
}
