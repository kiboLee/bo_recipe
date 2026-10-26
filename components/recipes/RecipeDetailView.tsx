import Image from 'next/image';
import Link from 'next/link';
import type { RecipeDetailDto } from '@/dto/recipe.dto';
import { Badge } from '@/components/ui/badge';
import { RecipePdfButton } from '@/components/recipes/RecipePdfButton';

interface RecipeDetailViewProps {
  // 상세 화면에 보여줄 레시피 데이터
  recipe: RecipeDetailDto;
}

// 레시피 상세 화면 본문 (대표 이미지, 메타, 재료, 조리 순서)
export function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  // 로컬 SVG 플레이스홀더는 이미지 최적화 대상이 아니므로 그대로 쓴다
  const isLocalSvg = recipe.thumbnailUrl?.endsWith('.svg') ?? false;

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/recipes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← 목록으로
      </Link>

      {/* 대표 이미지 */}
      {recipe.thumbnailUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={recipe.thumbnailUrl}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            unoptimized={isLocalSvg}
          />
        </div>
      )}

      {/* 제목과 설명 */}
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-base sm:text-lg text-muted-foreground break-words">{recipe.description}</p>
        )}
      </header>

      {/* 메타 정보 */}
      <section aria-labelledby="recipe-meta-title" className="space-y-3">
        <h2 id="recipe-meta-title" className="text-lg font-semibold text-foreground">
          1인분 기준
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <dt className="text-xs text-muted-foreground">조리 시간</dt>
            <dd className="font-semibold text-foreground">{recipe.cookingMinutes}분</dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <dt className="text-xs text-muted-foreground">난이도</dt>
            <dd>
              <Badge variant="secondary">{recipe.difficulty}</Badge>
            </dd>
          </div>
          {recipe.category && (
            <div className="rounded-lg border border-border bg-card p-3">
              <dt className="text-xs text-muted-foreground">카테고리</dt>
              <dd className="font-semibold text-foreground">{recipe.category}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* 재료 목록 (1인분 분량) */}
      <section aria-labelledby="recipe-ingredients-title" className="space-y-3">
        <h2 id="recipe-ingredients-title" className="text-lg font-semibold text-foreground">
          재료
        </h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {recipe.ingredients.map(ingredient => (
            <li
              key={ingredient.name}
              className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="min-w-0 break-words text-foreground">{ingredient.name}</span>
              <span className="shrink-0 text-muted-foreground">{ingredient.amount}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 조리 순서 (번호 목록) */}
      <section aria-labelledby="recipe-steps-title" className="space-y-3">
        <h2 id="recipe-steps-title" className="text-lg font-semibold text-foreground">
          조리 순서
        </h2>
        <ol className="space-y-4">
          {recipe.steps.map(step => (
            <li key={step.order} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.order}
              </span>
              <p className="min-w-0 break-words pt-0.5 text-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PDF 다운로드 버튼 (Route Handler에서 받아 저장) */}
      <RecipePdfButton slug={recipe.slug} />
    </article>
  );
}
