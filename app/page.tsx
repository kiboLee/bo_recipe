import { HomeClient } from '@/app/components/HomeClient';

// 정적 소개 영역은 서버 컴포넌트로 렌더링
export default function Home() {
  return (
    <HomeClient
      intro={
        <>
          <h1 className="text-3xl sm:text-5xl font-bold text-center text-foreground mb-4">
            AI와 함께 쇼핑하세요
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl mb-8">
            자연어로 상품, 주문, 배송, 환불 등을 편하게 상담받으세요.
            AI Agent가 항상 준비되어 있습니다.
          </p>
        </>
      }
    />
  );
}
