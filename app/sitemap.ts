import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { recipeService } from '@/services/recipe-service';

// 발행된 레시피 상세와 목록 페이지를 사이트맵에 넣는다 (초안은 listRecipes에서 이미 제외됨)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await recipeService.listRecipes({});

  return [
    { url: `${SITE_URL}/recipes` },
    ...recipes.map(recipe => ({
      url: `${SITE_URL}/recipes/${recipe.slug}`,
      lastModified: recipe.publishedAt,
    })),
  ];
}
