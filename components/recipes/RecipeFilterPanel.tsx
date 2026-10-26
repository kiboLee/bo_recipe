'use client';

import { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { RecipeListQuery } from '@/dto/recipe.dto';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RECIPE_CATEGORIES,
  RECIPE_DIFFICULTIES,
  RECIPE_SORT_OPTIONS,
  isDifficulty,
  isRecipeCategory,
  isRecipeSortOption,
} from '@/lib/recipe-options';

// 이 너비 이상이면 데스크톱: 필터 패널을 항상 펼친다
const DESKTOP_QUERY = '(min-width: 768px)';
// Select 전체 선택지 값 (쿼리에서 제외됨)
const ALL_VALUE = 'all';

interface RecipeFilterPanelProps {
  // 재료 태그 선택지 전체 목록
  availableIngredients: string[];
  // 현재 URL에서 읽은 목록 쿼리
  query: RecipeListQuery;
}

// 현재 쿼리를 목록 URL로 바꾼다. 비어 있는 값은 쿼리에 넣지 않는다
export function buildRecipeListHref(query: RecipeListQuery): string {
  const params = new URLSearchParams();

  if (query.ingredients?.length) params.set('ingredients', query.ingredients.join(','));
  if (query.category) params.set('category', query.category);
  if (query.difficulty) params.set('difficulty', query.difficulty);
  if (query.sort) params.set('sort', query.sort);

  const search = params.toString();
  return search ? `/recipes?${search}` : '/recipes';
}

// 데스크톱 여부를 구독한다 (서버 렌더링 시에는 모바일로 가정)
function subscribeToDesktop(onChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerDesktopSnapshot() {
  return false;
}

// 재료 멀티 선택, 카테고리·난이도, 정렬 필터 (모바일에서는 접을 수 있음)
export function RecipeFilterPanel({ availableIngredients, query }: RecipeFilterPanelProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot
  );

  const hasActiveFilter = Boolean(
    query.ingredients?.length || query.category || query.difficulty
  );

  // 필터 변경 시 URL 쿼리만 갱신하고 스크롤 위치는 유지한다
  const updateQuery = (nextQuery: RecipeListQuery) => {
    router.replace(buildRecipeListHref(nextQuery), { scroll: false });
  };

  const toggleIngredient = (tag: string, checked: boolean) => {
    const currentIngredients = query.ingredients ?? [];
    const nextIngredients = checked
      ? [...currentIngredients, tag]
      : currentIngredients.filter(item => item !== tag);

    updateQuery({ ...query, ingredients: nextIngredients });
  };

  const categoryItems = [
    { value: ALL_VALUE, label: '전체' },
    ...RECIPE_CATEGORIES.map(category => ({ value: category, label: category })),
  ];
  const difficultyItems = [
    { value: ALL_VALUE, label: '전체' },
    ...RECIPE_DIFFICULTIES.map(difficulty => ({ value: difficulty, label: difficulty })),
  ];

  return (
    <Collapsible open={isOpen || isDesktop} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full md:hidden" />}
      >
        {isOpen ? '필터 접기' : '필터 펼치기'}
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6">
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-foreground">재료 (모두 포함)</legend>
          {availableIngredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">등록된 재료가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {availableIngredients.map(tag => (
                <label key={tag} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={query.ingredients?.includes(tag) ?? false}
                    onCheckedChange={checked => toggleIngredient(tag, checked)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">카테고리</p>
            <Select
              items={categoryItems}
              value={query.category ?? ALL_VALUE}
              onValueChange={value =>
                updateQuery({ ...query, category: isRecipeCategory(value) ? value : undefined })
              }
            >
              <SelectTrigger aria-label="카테고리 선택" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryItems.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">난이도</p>
            <Select
              items={difficultyItems}
              value={query.difficulty ?? ALL_VALUE}
              onValueChange={value =>
                updateQuery({ ...query, difficulty: isDifficulty(value) ? value : undefined })
              }
            >
              <SelectTrigger aria-label="난이도 선택" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyItems.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">정렬</p>
            <Select
              items={RECIPE_SORT_OPTIONS.map(option => ({ value: option.value, label: option.label }))}
              value={query.sort ?? RECIPE_SORT_OPTIONS[0].value}
              onValueChange={value =>
                updateQuery({ ...query, sort: isRecipeSortOption(value) ? value : undefined })
              }
            >
              <SelectTrigger aria-label="정렬 선택" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECIPE_SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilter && (
          <Button variant="outline" render={<Link href="/recipes" />}>
            필터 초기화
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
