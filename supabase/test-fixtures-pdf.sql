-- PDF 샘플 검증용 테스트 행 (Task 016)
-- 1) 아래 insert를 SQL Editor에서 실행한다.
-- 2) /api/recipes/{슬러그}/pdf 로 PDF를 받아 육안으로 확인한다.
-- 3) 검증이 끝나면 맨 아래 cleanup 문으로 테스트 행을 삭제한다.

insert into public.recipes (slug, title, description, image_url, ingredient_tags, difficulty, cook_time_minutes, category, status, published_at, ingredient_items, steps)
values
  -- 짧은 레시피: 재료 2개, 조리 2단계
  ('test-pdf-short', '테스트 짧은 레시피', '재료와 단계가 적은 경우', '/recipe-placeholder.svg', array['계란']::text[], '쉬움', 3, '간단식', '발행', '2026-10-27'::timestamptz,
    '[{"name": "계란", "amount": "1개"}, {"name": "소금", "amount": "한 꼬집"}]'::jsonb,
    '[{"order": 1, "text": "계란을 깨서 풀어 준다."}, {"order": 2, "text": "소금을 넣고 팬에 부쳐 익힌다."}]'::jsonb),
  -- 재료가 많은 레시피: 재료 14개
  ('test-pdf-many-ingredients', '테스트 재료 많은 레시피', '재료 목록이 길어질 때 줄이 넘어가는지 확인', '/recipe-placeholder.svg', array['비빔밥']::text[], '보통', 30, '한식', '발행', '2026-10-27'::timestamptz,
    '[{"name": "밥", "amount": "1공기"}, {"name": "당근", "amount": "1/4개"}, {"name": "애호박", "amount": "1/4개"}, {"name": "시금치", "amount": "한 줌"}, {"name": "콩나물", "amount": "한 줌"}, {"name": "고사리", "amount": "5개"}, {"name": "계란", "amount": "1개"}, {"name": "고추장", "amount": "1큰술"}, {"name": "참기름", "amount": "1큰술"}, {"name": "간장", "amount": "1작은술"}, {"name": "다진 마늘", "amount": "1/2작은술"}, {"name": "깨", "amount": "약간"}, {"name": "김가루", "amount": "약간"}, {"name": "식용유", "amount": "1큰술"}]'::jsonb,
    '[{"order": 1, "text": "나물 재료를 각각 데치거나 볶아 식혀 둔다."}]'::jsonb),
  -- 조리 단계가 긴 레시피: 단계 12개
  ('test-pdf-long-steps', '테스트 조리 단계 긴 레시피', '조리 순서가 길어 여러 페이지로 넘어가는지 확인', '/recipe-placeholder.svg', array['두부']::text[], '보통', 45, '한식', '발행', '2026-10-27'::timestamptz,
    '[{"name": "두부", "amount": "1/2모"}, {"name": "양파", "amount": "1/4개"}, {"name": "애호박", "amount": "1/4개"}, {"name": "된장", "amount": "1큰술"}]'::jsonb,
    '[{"order": 1, "text": "두부를 한 입 크기로 썰어 찬물에 담가 둔다."}, {"order": 2, "text": "양파와 애호박을 먹기 좋은 크기로 썬다."}, {"order": 3, "text": "냄비에 물 500ml를 붓고 멸치 육수를 낸다."}, {"order": 4, "text": "육수가 우러나면 멸치를 건져 낸다."}, {"order": 5, "text": "된장을 체에 걸러 풀어 넣는다."}, {"order": 6, "text": "양파와 애호박을 넣고 중불에서 5분 끓인다."}, {"order": 7, "text": "채소가 익으면 두부를 넣는다."}, {"order": 8, "text": "두부가 뜨기 시작하면 불을 줄인다."}, {"order": 9, "text": "고추와 대파를 어슷하게 썰어 준비한다."}, {"order": 10, "text": "고추와 대파를 넣고 한소끔 더 끓인다."}, {"order": 11, "text": "간을 보고 싱거우면 된장을 조금 더 푼다."}, {"order": 12, "text": "그릇에 담아 뜨거울 때 낸다."}]'::jsonb),
  -- 대표 이미지 다운로드 실패: 존재하지 않는 Supabase 주소 (네트워크 실패 → 이미지 없이 생성되어야 함)
  ('test-pdf-image-fail', '테스트 이미지 실패', null, 'https://no-such-ref-0000.supabase.co/storage/v1/object/public/none.png', array['계란']::text[], '쉬움', 3, '간단식', '발행', '2026-10-27'::timestamptz,
    '[{"name": "계란", "amount": "1개"}]'::jsonb,
    '[{"order": 1, "text": "계란을 프라이팬에 부친다."}]'::jsonb)
on conflict (slug) do nothing;

-- cleanup: 검증이 끝나면 실행
-- delete from public.recipes where slug like 'test-pdf-%';
