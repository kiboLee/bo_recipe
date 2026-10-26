import { redirect } from 'next/navigation';

// 홈은 레시피 목록(/recipes)으로 바로 보낸다
export default function Home() {
  redirect('/recipes');
}
