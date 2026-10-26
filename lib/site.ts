// 사이트 공개 주소 (canonical, sitemap, OG 이미지 절대 주소에 쓴다). 배포 후 환경 변수로 실제 도메인을 넣는다
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// 대표 이미지가 없을 때 메타데이터에 쓰는 기본 이미지 (public 자산)
export const DEFAULT_OG_IMAGE_PATH = '/recipe-placeholder.svg';
