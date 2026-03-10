import React from 'react';
import { Zap } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-lemon text-ink shadow-2xl shadow-lemon/40">
        <Zap size={48} fill="currentColor" strokeWidth={0} className="animate-pulse" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight animate-pulse">Initializing Serviceberg...</h3>
      <p className="text-sm font-medium text-ink/40 mt-2">Connecting to secure data vault</p>
    </div>
  );
};
