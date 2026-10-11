'use client';

import { Package, Truck, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickMenuProps {
  onSelectMenu: (query: string) => void;
}

const menuItems = [
  {
    icon: Package,
    label: '주문 조회',
    description: '최근 주문 현황',
    query: '최근 주문 내역 보여줘'
  },
  {
    icon: Truck,
    label: '배송 조회',
    description: '배송 상태 확인',
    query: '배송 현황 알려줘'
  },
  {
    icon: RefreshCw,
    label: '환불 안내',
    description: '환불 방법 안내',
    query: '환불 방법 알려줘'
  },
  {
    icon: Search,
    label: '상품 추천',
    description: '상품 추천 받기',
    query: '상품 추천해줘'
  }
];

export function QuickMenu({ onSelectMenu }: QuickMenuProps) {
  return (
    <div className="bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          빠른 메뉴
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                type="button"
                variant="outline"
                onClick={() => onSelectMenu(item.query)}
                className="group h-auto bg-card p-4 sm:p-6 hover:border-primary hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {item.label}
                    </p>
                    <p className="text-xs sm:text-sm font-normal text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
