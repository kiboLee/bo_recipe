import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF 생성 시 fs로 읽는 한글 폰트를 서버리스 번들에 포함시킨다 (정적 분석으로는 추적되지 않음)
  outputFileTracingIncludes: {
    '/api/recipes/\\[slug\\]/pdf': ['./assets/fonts/**/*'],
  },
  images: {
    // Supabase Storage 공개 이미지 URL 호스트 허용 (** : 여러 단계 서브도메인 허용)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
