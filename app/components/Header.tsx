'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { navItems } from '@/lib/constants';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 서비스명 (페이지의 h1은 본문에서 사용) */}
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <ShoppingBag size={24} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">
              <span className="sm:hidden">AI Agent</span>
              <span className="hidden sm:inline">Ecommerce AI Agent</span>
            </span>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-8" aria-label="주요 메뉴">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <nav
            id="mobile-menu"
            aria-label="모바일 메뉴"
            className="md:hidden pb-4 space-y-2 border-t border-border pt-4"
          >
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
