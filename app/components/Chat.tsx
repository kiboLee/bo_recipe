'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exampleQuestions } from '@/lib/constants';
import { getMockResponse } from '@/lib/mockResponses';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  // 메인 화면에서 선택한 질문 (있으면 대화 시작과 동시에 전송)
  initialQuery?: string | null;
}

const GREETING_MESSAGE: Message = {
  id: 'greeting',
  type: 'assistant',
  content: '안녕하세요! Ecommerce AI Agent입니다. 무엇을 도와드릴까요?'
};

const ERROR_MESSAGE = '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
const MAX_INPUT_LENGTH = 500;
const RESPONSE_DELAY_MS = 500;

const createUserMessage = (content: string): Message => ({
  id: crypto.randomUUID(),
  type: 'user',
  content
});

export function Chat({ initialQuery = null }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    initialQuery ? [GREETING_MESSAGE, createUserMessage(initialQuery)] : [GREETING_MESSAGE]
  );
  const [input, setInput] = useState('');
  // 응답을 기다리는 사용자 질문 (null이면 대기 중이 아님)
  const [pendingQuery, setPendingQuery] = useState<string | null>(initialQuery);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = pendingQuery !== null;
  const isInitialState = messages.length === 1;

  // 메시지 끝으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // AI 응답 시뮬레이션 (언마운트 시 타이머 정리)
  useEffect(() => {
    if (pendingQuery === null) return;

    const timerId = setTimeout(() => {
      let content: string;
      try {
        content = getMockResponse(pendingQuery);
      } catch {
        content = ERROR_MESSAGE;
      } finally {
        setPendingQuery(null);
      }
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), type: 'assistant', content }
      ]);
    }, RESPONSE_DELAY_MS);

    return () => clearTimeout(timerId);
  }, [pendingQuery]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, createUserMessage(trimmed)]);
    setInput('');
    setPendingQuery(trimmed);
  };

  // form 제출은 한글 IME 조합 중 Enter를 중복 처리하지 않음
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* 채팅 영역 */}
      <div
        role="log"
        aria-live="polite"
        aria-label="대화 내용"
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {isInitialState && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              무엇을 도와드릴까요?
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              상품, 주문, 배송, 환불 등 무엇이든 물어봐주세요.
              AI Agent가 도움을 드리겠습니다.
            </p>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={cn('flex', message.type === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg whitespace-pre-wrap',
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg" aria-label="응답 작성 중">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:100ms]" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:200ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 예시 질문 (초기 상태) */}
      {isInitialState && !isLoading && (
        <div className="px-4 sm:px-6 pb-4 space-y-2">
          <p className="text-sm text-muted-foreground mb-3">예시 질문</p>
          <div className="space-y-2">
            {exampleQuestions.map(question => (
              <Button
                key={question}
                type="button"
                variant="outline"
                onClick={() => sendMessage(question)}
                className="h-auto w-full justify-start whitespace-normal p-3 text-left text-sm font-normal"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 입력창 */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-background p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="질문을 입력해주세요..."
            aria-label="질문 입력"
            maxLength={MAX_INPUT_LENGTH}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon-lg"
            aria-label="전송"
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}
