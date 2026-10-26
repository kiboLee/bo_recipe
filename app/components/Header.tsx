import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

// 공통 헤더 (서버 컴포넌트): 서비스 로고와 테마 전환 버튼만 둔다
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 서비스명 (목록 페이지로 이동) */}
          <Link href="/recipes" className="flex items-center gap-3 text-foreground">
            <span className="bg-primary text-primary-foreground p-2 rounded-lg">
              <ChefHat size={24} aria-hidden="true" />
            </span>
            <span className="text-lg sm:text-xl font-bold">요리 레시피</span>
          </Link>

          {/* 다크/라이트 모드 전환 */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
