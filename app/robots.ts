import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// 모든 검색엔진에 공개하고, API 경로는 색인에서 뺀다
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
