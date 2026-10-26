import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "요리 레시피",
  description: "냉장고 속 재료로 만드는 1인분 레시피",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 헤더·메인·푸터 골격. 메인 영역이 남은 높이를 채우고 내부에서 스크롤한다 */}
      <body className="h-dvh flex flex-col">
        {/* 키보드 사용자가 헤더를 건너뛰고 본문으로 바로 갈 수 있게 한다 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content" className="flex flex-1 min-h-0 flex-col overflow-y-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
