import Link from 'next/link';

// 존재하지 않는 경로 또는 notFound() 호출 시 표시되는 404 골격
export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-foreground">페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">요청하신 주소가 없거나 비공개 레시피입니다.</p>
      <Link href="/recipes" className="text-primary underline underline-offset-4">
        목록으로 돌아가기
      </Link>
    </div>
  );
}
