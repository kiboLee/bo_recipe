import Image from 'next/image';
import Link from 'next/link';
import type { RecipeSummaryDto } from '@/dto/recipe.dto';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

interface RecipeCardProps {
  // 목록에 보여줄 레시피 요약
  recipe: RecipeSummaryDto;
  // 첫 화면에 보이는 카드는 LCP 개선을 위해 우선 로딩한다
  priority?: boolean;
}

// 목록의 레시피 카드 한 장 (상세 페이지로 이동)
export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  // 로컬 SVG 플레이스홀더는 이미지 최적화 대상이 아니므로 그대로 쓴다
  const isLocalSvg = recipe.thumbnailUrl?.endsWith('.svg') ?? false;

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full overflow-hidden py-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-video w-full bg-muted">
          {recipe.thumbnailUrl && (
            <Image
              src={recipe.thumbnailUrl}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover"
              unoptimized={isLocalSvg}
            />
          )}
        </div>
        <CardContent className="space-y-2 pb-4">
          <h2 className="text-lg font-semibold text-foreground">{recipe.title}</h2>
          {recipe.description && (
            <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
            <Badge variant="secondary">{recipe.difficulty}</Badge>
            <span>{recipe.cookingMinutes}분</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
