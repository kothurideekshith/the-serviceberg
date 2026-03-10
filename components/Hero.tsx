
import React from 'react';
import { Search, Star, Zap, ShieldCheck, Award, Shield, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      <div className="col-span-1 md:col-span-3 rounded-[3.5rem] bg-iceBlue border border-smoke p-12 lg:p-20 relative overflow-hidden group">
        {/* Background Branding Elements */}
        <div className="absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-white/30 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-white border border-smoke px-4 py-2 text-xs font-bold text-ink">
            <Star size={12} className="fill-lemon text-lemon" strokeWidth={0} /> Precision performance
          </span>
          <h1 className="text-fluid-h1 mb-8 font-bold tracking-tighter text-ink">
            The Summit <br /> <span className="text-ink/20">of Excellence.</span>
          </h1>
          <p className="mb-12 text-lg leading-relaxed text-ink/40 max-w-lg">
            Curated household services delivered by vetted artisans. Experience the gold standard in domestic support, powered by precision logistics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
              <input 
                type="text" 
                placeholder="Search specialized services..." 
                className="w-full rounded-2xl bg-white border border-smoke py-5 pl-14 pr-6 text-sm outline-none ring-lemon/10 transition-all focus:border-lemon focus:ring-4 font-bold"
              />
            </div>
            <button 
              onClick={onStartClick}
              className="rounded-2xl bg-ink px-10 py-5 text-sm font-bold text-white transition-all hover:bg-ink/90 active:scale-95 shadow-xl shadow-ink/10"
            >
              Find your pro
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-6">
        {/* Top Right Tile: Verification & Vetting */}
        <div className="flex-1 rounded-[2.5rem] bg-ink p-8 flex flex-col justify-end group cursor-default transition-all hover:shadow-2xl hover:shadow-ink/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={120} className="text-white" />
          </div>
          
          <div className="mb-auto">
            <div className="h-10 w-10 rounded-xl bg-lemon flex items-center justify-center text-ink shadow-[0_0_15px_rgba(255,247,127,0.4)]">
              <ShieldCheck size={20} />
            </div>
          </div>
          
          <div className="text-white relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">Elite 3% Network</h3>
              <span className="bg-white/10 text-[9px] font-bold px-2 py-0.5 rounded-full text-lemon">Verified</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-medium">
              Only 3 out of every 100 applying agencies pass our proprietary 5-step technical and security audit. We reject the rest so you don't have to.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-white/30 border-t border-white/5 pt-4">
              <CheckCircle2 size={10} className="text-lemon" /> Criminal & Skill Audited
            </div>
          </div>
        </div>

        {/* Bottom Right Tile: The Guarantee */}
        <div className="flex-1 rounded-[2.5rem] bg-lemon p-8 flex flex-col justify-end group cursor-pointer transition-all hover:-rotate-1 active:scale-95 shadow-md shadow-lemon/10 relative overflow-hidden" onClick={onStartClick}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={120} className="text-ink" />
          </div>

           <div className="mb-auto flex flex-col gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-4 border-lemon overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?u=${i + 15}`} alt="Pro" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full bg-ink flex items-center justify-center text-[10px] font-bold text-white border-4 border-lemon">10k+</div>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink/5 rounded-full w-fit">
                <Shield size={10} className="text-ink/40" />
                <span className="text-[9px] font-bold tracking-tight text-ink/60">Fully Insured</span>
              </div>
          </div>

          <div className="text-ink relative z-10">
            <h3 className="text-lg font-bold mb-1">Ironclad Guarantee</h3>
            <p className="text-[11px] font-bold opacity-60 leading-tight">
              100% Corporate Responsibility. If our artisan doesn't exceed standards, we re-execute for free or refund instantly. No questions.
            </p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold border-t border-ink/10 pt-4">
               <span>Trust Score 9.8/10</span>
               <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowUpRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);
