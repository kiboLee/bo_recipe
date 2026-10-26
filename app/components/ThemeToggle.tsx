'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 테마 설정을 저장하는 localStorage 키
const THEME_STORAGE_KEY = 'theme';
// 다크 모드 토큰을 활성화하는 html 클래스 (globals.css의 .dark)
const DARK_CLASS = 'dark';

// 저장된 테마 값을 읽는다. 저장소 접근이 막혀 있으면 null을 반환한다
function readStoredTheme(): 'dark' | 'light' | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

// 테마 값을 저장한다. 저장에 실패해도 화면 전환은 그대로 동작한다
function writeStoredTheme(theme: 'dark' | 'light') {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 저장소를 사용할 수 없는 환경(비공개 모드 등)에서는 무시한다
  }
}

// html 요소의 class 변화를 구독해 현재 다크 모드 여부를 알려준다
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getIsDarkSnapshot() {
  return document.documentElement.classList.contains(DARK_CLASS);
}

// 서버 렌더링 시에는 라이트 모드로 가정한다 (마운트 후 실제 값으로 갱신)
function getServerIsDarkSnapshot() {
  return false;
}

// 다크/라이트 모드 전환 버튼 (FR-06)
export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getIsDarkSnapshot,
    getServerIsDarkSnapshot
  );

  // 마운트 후 저장된 값이 있으면 그 값을, 없으면 시스템 설정을 따른다
  useEffect(() => {
    const storedTheme = readStoredTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    document.documentElement.classList.toggle(DARK_CLASS, initialDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;

    document.documentElement.classList.toggle(DARK_CLASS, nextDark);
    writeStoredTheme(nextDark ? 'dark' : 'light');
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </Button>
  );
}
