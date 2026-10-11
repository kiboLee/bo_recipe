// 예시 질문 (메인 화면, 채팅 화면 공용)
export const exampleQuestions = [
  '내 주문 배송 현황 알려줘',
  '최근 주문한 상품 보여줘',
  '상품 환불 방법 알려줘',
  '무선 이어폰 추천해줘'
] as const;

// 헤더 내비게이션 메뉴 (데스크톱/모바일 공용)
// TODO: 각 페이지 구현 시 href를 실제 경로로 교체
export const navItems = [
  { label: '주문', href: '/' },
  { label: '배송', href: '/' },
  { label: '상품', href: '/' },
  { label: '고객지원', href: '/' }
] as const;
