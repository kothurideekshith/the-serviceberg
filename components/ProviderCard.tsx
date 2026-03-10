
import React, { useState } from 'react';
import { Provider } from '../types';
import { Heart, Star, MapPin } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  onClick: (providerId: string) => void;
  offer?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onClick, offer }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Determine a default mock arrival time if not present
  const arrivalTime = "45 min";

  return (
    <div 
      onClick={() => provider.isActive !== false && onClick(provider.id)}
      className={`group relative transition-all duration-300 ${provider.isActive !== false ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default opacity-60'}`}
      role="button"
      aria-label={`View ${provider.name} profile`}
    >
      {/* Image Container / Banner */}
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-pearl border border-smoke">
        <img 
          src={provider.coverImage || provider.image} 
          alt={provider.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Coming Soon Overlay */}
        {provider.isActive === false && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-white/90 px-6 py-2 rounded-full shadow-xl border border-white">
              <span className="text-sm font-bold text-ink">Coming Soon</span>
            </div>
          </div>
        )}
        
        {/* Dynamic Badge: Updated to use normal casing */}
        {offer && provider.isActive !== false && (
          <div className="absolute left-3 top-3 z-10">
            <div className="flex items-center bg-[#FFF77F] text-ink px-2.5 py-1.5 rounded-md shadow-lg border border-ink/5">
              <span className="text-[11px] font-bold leading-none tracking-tight">
                {offer}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="mt-4 flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-ink truncate leading-tight flex-1">
            {provider.name}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="shrink-0 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart 
              size={22} 
              className={isLiked ? "fill-[#FFF77F] text-ink" : "text-ink/30"} 
            />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-ink/60">
          <div className="flex items-center gap-1 text-ink">
            <span className="font-bold">{provider.rating.toFixed(1)}</span>
            <Star size={14} className="fill-ink text-ink" />
          </div>
          <span className="opacity-70">({provider.reviews.replace('+', '')}+)</span>
          <span className="mx-0.5 opacity-30">•</span>
          <span className="font-medium">{arrivalTime}</span>
        </div>
      </div>
    </div>
  );
};
