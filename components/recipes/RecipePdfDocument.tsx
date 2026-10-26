import path from 'node:path';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { RecipeDetailDto } from '@/dto/recipe.dto';

// 한글 폰트 (Noto Sans KR, SIL OFL: assets/fonts/LICENSE-NotoSansKR.txt)
const FONT_FAMILY = 'NotoSansKR';
const FONT_PATH = path.join(process.cwd(), 'assets', 'fonts', 'NotoSansKR-Regular.ttf');

// 모듈이 처음 로드될 때 폰트를 한 번 등록한다
Font.register({ family: FONT_FAMILY, src: FONT_PATH });
// 한글 단어를 하이픈으로 쪼개지 않도록 하이픈 처리를 끈다
Font.registerHyphenationCallback(word => [word]);

// PDF에 넣을 대표 이미지 (PNG 또는 JPG 바이트)
export interface RecipePdfImage {
  // 이미지 바이트
  data: Buffer;
  // react-pdf가 읽는 이미지 형식
  format: 'png' | 'jpg';
}

const styles = StyleSheet.create({
  page: { fontFamily: FONT_FAMILY, fontSize: 11, padding: 40, color: '#111111' },
  title: { fontSize: 22, marginBottom: 6 },
  description: { fontSize: 12, color: '#555555', marginBottom: 12 },
  image: { width: '100%', height: 200, marginBottom: 12 },
  meta: { fontSize: 11, color: '#333333', marginBottom: 14 },
  sectionTitle: { fontSize: 14, marginTop: 14, marginBottom: 6 },
  ingredientRow: { flexDirection: 'row', marginBottom: 3 },
  ingredientName: { width: '50%' },
  stepRow: { flexDirection: 'row', marginBottom: 6 },
  stepNumber: { width: 24 },
  stepText: { flex: 1 },
});

interface RecipePdfDocumentProps {
  // PDF에 담을 레시피 상세 데이터
  recipe: RecipeDetailDto;
  // 대표 이미지 (다운로드 실패 시 생략)
  image?: RecipePdfImage;
}

// 레시피 한 장짜리 PDF 문서 (제목, 대표 이미지, 메타, 재료, 조리 순서 세로 배치)
function RecipePdfDocument({ recipe, image }: RecipePdfDocumentProps) {
  const metaParts = [
    '1인분 기준',
    `조리 ${recipe.cookingMinutes}분`,
    recipe.difficulty,
    recipe.category,
  ].filter(Boolean);

  return (
    <Document title={recipe.title} author="요리 레시피">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{recipe.title}</Text>
        {recipe.description && <Text style={styles.description}>{recipe.description}</Text>}
        {/* react-pdf의 Image에는 alt가 없어서 jsx-a11y 경고를 이 줄에서만 끈다 */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        {image && <Image src={image} style={styles.image} />}
        <Text style={styles.meta}>{metaParts.join(' · ')}</Text>

        <Text style={styles.sectionTitle}>재료</Text>
        {recipe.ingredients.map(item => (
          <View key={item.name} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text>{item.amount}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>조리 순서</Text>
        {recipe.steps.map(step => (
          <View key={step.order} style={styles.stepRow} wrap={false}>
            <Text style={styles.stepNumber}>{step.order}.</Text>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

// 레시피 상세로 PDF 바이트를 만든다. JSX를 쓸 수 없는 Route Handler(.ts)에서 호출한다
export function renderRecipePdf(recipe: RecipeDetailDto, image?: RecipePdfImage): Promise<Buffer> {
  return renderToBuffer(RecipePdfDocument({ recipe, image }));
}
