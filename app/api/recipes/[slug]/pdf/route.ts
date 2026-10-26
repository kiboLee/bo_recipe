import { renderRecipePdf, type RecipePdfImage } from '@/components/recipes/RecipePdfDocument';
import { recipeService } from '@/services/recipe-service';

// 대표 이미지 다운로드 제한 시간 (ms). 넘기면 이미지 없이 PDF를 만든다
const IMAGE_TIMEOUT_MS = 5000;

interface RecipePdfRouteContext {
  // 동적 라우트 params는 Promise이므로 반드시 await 한다 (Next.js 16)
  params: Promise<{ slug: string }>;
}

// Content-Type을 react-pdf 이미지 형식으로 바꾼다. PNG·JPG가 아니면 undefined
function toImageFormat(contentType: string): RecipePdfImage['format'] | undefined {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/jpeg') return 'jpg';
  return undefined;
}

// 외부 대표 이미지를 받아온다. 실패하거나 지원하지 않는 형식이면 undefined (PDF는 이미지 없이 생성)
async function loadThumbnail(url: string | undefined): Promise<RecipePdfImage | undefined> {
  if (!url || !url.startsWith('https://')) return undefined;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
    if (!response.ok) return undefined;

    const contentType = response.headers.get('content-type')?.split(';')[0] ?? '';
    const format = toImageFormat(contentType);
    if (!format) return undefined;

    return { data: Buffer.from(await response.arrayBuffer()), format };
  } catch {
    return undefined;
  }
}

// 발행된 레시피의 PDF를 내려준다. 미발행·미존재 슬러그는 404
export async function GET(_request: Request, { params }: RecipePdfRouteContext) {
  const { slug } = await params;
  const recipe = await recipeService.getRecipeBySlug(slug);

  if (!recipe) {
    return new Response('레시피를 찾을 수 없습니다', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const image = await loadThumbnail(recipe.thumbnailUrl);
    const pdf = await renderRecipePdf(recipe, image);

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      },
    });
  } catch (error) {
    // PDF 생성 실패는 서버 로그에 남기고 사용자에게는 일반 오류를 보낸다
    console.error('[recipe-pdf] PDF 생성 실패', slug, error);
    return new Response('PDF를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
