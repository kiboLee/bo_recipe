// 서버 전용 모듈: 클라이언트 번들에 포함되면 빌드가 실패하도록 가드한다
import 'server-only';

export interface ServerEnv {
  // Supabase 프로젝트 URL (https://<project-ref>.supabase.co)
  supabaseUrl: string;
  // Supabase publishable key (RLS로 발행 레시피만 읽을 수 있는 공개 키)
  supabasePublishableKey: string;
}

// 서버 환경 변수를 읽고 검증한다. 필수 값이 없으면 어떤 변수인지 알 수 있도록 에러를 던진다
export function getServerEnv(): ServerEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다');
  }

  if (!supabasePublishableKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 설정되지 않았습니다');
  }

  return { supabaseUrl, supabasePublishableKey };
}
