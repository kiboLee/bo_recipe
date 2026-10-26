-- 제외 경로 검증용 테스트 행 (Task 010, 011, 013)
-- 1) 아래 insert를 SQL Editor에서 실행한다.
-- 2) 검증이 끝나면 맨 아래 cleanup 문으로 테스트 행을 삭제한다.

insert into public.recipes (slug, title, description, image_url, ingredient_tags, difficulty, cook_time_minutes, category, status, published_at, ingredient_items, steps)
values
  -- 재료 상세가 빈 배열: 목록과 상세에서 모두 제외되어야 함
  ('test-no-ingredients', '테스트 재료 없음', null, '/recipe-placeholder.svg', array['테스트']::text[], '쉬움', 5, '간단식', '발행', '2026-10-27'::timestamptz, '[]'::jsonb, '[{"order": 1, "text": "테스트"}]'::jsonb),
  -- 조리 순서가 뒤섞이고 잘못된 항목이 섞임: 정렬되고 잘못된 항목은 제외, 번호 공백 경고
  ('test-bad-steps', '테스트 잘못된 조리 순서', null, '/recipe-placeholder.svg', array['테스트']::text[], '쉬움', 5, '간단식', '발행', '2026-10-27'::timestamptz, '[{"name": "테스트", "amount": "1개"}]'::jsonb, '[{"order": 3, "text": "세 번째"}, {"order": 1, "text": "첫 번째"}, {"order": "x", "text": "잘못된 번호"}, {"order": 2, "text": ""}]'::jsonb),
  -- 허용되지 않은 외부 이미지: 플레이스홀더로 대체되고 경고 로그
  ('test-bad-image', '테스트 외부 이미지', null, 'https://evil.example.com/a.png', array['테스트']::text[], '쉬움', 5, '간단식', '발행', '2026-10-27'::timestamptz, '[{"name": "테스트", "amount": "1개"}]'::jsonb, '[{"order": 1, "text": "테스트"}]'::jsonb),
  -- 초안 상태: 목록과 상세 모두에서 제외되어야 함 (상세 URL은 404)
  ('test-draft', '테스트 초안', null, null, array['테스트']::text[], '쉬움', 5, '간단식', '초안', '2026-10-27'::timestamptz, '[{"name": "테스트", "amount": "1개"}]'::jsonb, '[{"order": 1, "text": "테스트"}]'::jsonb)
on conflict (slug) do nothing;

-- cleanup: 검증이 끝나면 실행
-- delete from public.recipes where slug like 'test-%';
