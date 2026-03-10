import React from 'react';
import { Ticket, ChevronRight } from 'lucide-react';

interface BasketButtonProps {
  basketCount: number;
  onClick: () => void;
}

export const BasketButton: React.FC<BasketButtonProps> = ({ basketCount, onClick }) => {
  if (basketCount === 0) return null;

  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[50] flex items-center gap-3 rounded-2xl bg-lemon px-6 py-4 text-sm font-bold text-ink shadow-2xl shadow-lemon/40 hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-8 duration-500"
    >
      <div className="relative">
        <Ticket size={20} />
        <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-ink text-white text-[10px] flex items-center justify-center border-2 border-lemon font-bold">
          {basketCount}
        </span>
      </div>
      <span className="tracking-tight">View Basket</span>
      <ChevronRight size={18} />
    </button>
  );
};
