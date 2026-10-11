// AI 응답 목업 데이터 (실제 API 연동 시 Service 계층으로 대체)
const sampleResponses: Record<string, string> = {
  '배송': '주문번호 #12345의 배송현황을 확인했습니다.\n\n📦 상태: 배송 중\n🚚 예상 배송일: 내일\n📍 현재위치: 부산 배송센터\n\n추가 도움이 필요하시면 알려주세요!',
  '주문': '최근 주문 내역입니다.\n\n1️⃣ 무선 이어폰 (₩89,000) - 2024.11.20\n2️⃣ USB-C 케이블 3개팩 (₩15,000) - 2024.11.18\n3️⃣ 휴대폰 케이스 (₩25,000) - 2024.11.15\n\n자세한 내용을 알고 싶은 주문이 있나요?',
  '환불': '환불 절차를 안내해드리겠습니다.\n\n📋 환불 가능 기한: 구매 후 14일 이내\n📩 신청 방법: 마이페이지 > 주문/배송 > 환불신청\n⏰ 처리기간: 신청 후 3~5 영업일\n💳 환불계좌: 원래 결제 수단으로 자동 환불\n\n환불 신청을 도와드릴까요?',
  '추천': '무선 이어폰 추천입니다!\n\n🎧 인기 상품:\n• 프리미엄 노이즈캔슬 이어폰 (₩189,000)\n  ⭐ 평점: 4.8/5 (1,234개 리뷰)\n• 스포츠 방수 이어폰 (₩79,000)\n  ⭐ 평점: 4.6/5 (856개 리뷰)\n• 가성비 무선 이어폰 (₩49,000)\n  ⭐ 평점: 4.5/5 (2,103개 리뷰)\n\n상세정보나 구매를 도와드릴까요?'
};

const defaultResponse =
  '안녕하세요! 무엇을 도와드릴까요?\n\n다음과 같이 도움을 드릴 수 있습니다:\n• 주문 조회\n• 배송 현황 확인\n• 환불 및 교환\n• 상품 검색\n• 기타 고객 지원\n\n편한 말로 물어봐주세요!';

// 입력된 텍스트에 포함된 키워드에 따라 응답 선택
export function getMockResponse(userMessage: string): string {
  for (const [keyword, response] of Object.entries(sampleResponses)) {
    if (userMessage.includes(keyword)) {
      return response;
    }
  }
  return defaultResponse;
}
