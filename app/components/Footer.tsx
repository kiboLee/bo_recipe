// 공통 푸터 (서버 컴포넌트, 상태 없음)
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-muted-foreground text-center">
        {/* 서비스 소개 및 저작 표기 */}
        <p>냉장고 속 재료로 만드는 1인분 레시피</p>
        <p className="mt-1">© {new Date().getFullYear()} 요리 레시피</p>
      </div>
    </footer>
  );
}
