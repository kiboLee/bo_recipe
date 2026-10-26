// 서버 전용 모듈: Supabase 클라이언트가 화면 코드에서 직접 쓰이지 않도록 가드한다
import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/lib/env';

let clientInstance: SupabaseClient | null = null;

// Supabase 클라이언트 싱글턴. 환경 변수는 첫 호출 시점에 검증한다
export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    const { supabaseUrl, supabasePublishableKey } = getServerEnv();
    clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false },
    });
  }
  return clientInstance;
}
