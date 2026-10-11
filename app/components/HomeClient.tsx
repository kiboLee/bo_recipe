'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exampleQuestions } from '@/lib/constants';
import { Header } from './Header';
import { Chat } from './Chat';
import { QuickMenu } from './QuickMenu';

interface HomeClientProps {
  // 서버 컴포넌트에서 렌더링한 정적 소개 영역
  intro: React.ReactNode;
}

// 화면 전환(소개 ↔ 채팅) 상태만 클라이언트에서 관리
export function HomeClient({ intro }: HomeClientProps) {
  const [showChat, setShowChat] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);

  const startChat = (query: string | null = null) => {
    setInitialQuery(query);
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
    setInitialQuery(null);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-background',
        showChat ? 'h-dvh' : 'min-h-dvh'
      )}
    >
      <Header />

      {!showChat ? (
        <>
          {/* 메인 소개 영역 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
            {intro}

            {/* Chat 입력 시작 버튼 */}
            <Button
              type="button"
              size="lg"
              onClick={() => startChat()}
              className="h-11 px-8 text-base font-semibold mb-12"
            >
              대화 시작하기
            </Button>

            {/* 예시 질문 */}
            <div className="w-full max-w-2xl mb-12">
              <p className="text-muted-foreground text-center text-sm mb-4">
                어떤 것을 물어보고 싶으신가요?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exampleQuestions.map(question => (
                  <Button
                    key={question}
                    type="button"
                    variant="outline"
                    onClick={() => startChat(question)}
                    className="h-auto justify-start whitespace-normal p-4 text-left text-sm font-normal hover:border-primary"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 빠른 메뉴 */}
          <QuickMenu onSelectMenu={startChat} />
        </>
      ) : (
        <>
          {/* Chat 모드 */}
          <div className="flex-1 min-h-0">
            <Chat initialQuery={initialQuery} />
          </div>

          {/* Chat 종료 버튼 */}
          <div className="bg-background border-t border-border p-4 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={closeChat}
              className="text-muted-foreground"
            >
              <ArrowLeft size={16} />
              돌아가기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
