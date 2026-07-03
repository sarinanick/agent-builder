'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Share2, Copy, Check, Download } from 'lucide-react';
import type { Artwork } from './data';

interface FilmstripModalProps {
  item: Artwork | null;
  navList: Artwork[];
  navIndex: number;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}

export default function FilmstripModal({ item, navList, navIndex, onClose, onNavigate }: FilmstripModalProps) {
  const [zoomed, setZoomed] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('PNG');
  const filmstripRef = useRef<HTMLDivElement>(null);
  const filmDrag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (autoplay) {
      setAutoplayProgress(0);
      autoplayRef.current = setInterval(() => {
        setAutoplayProgress((prev) => {
          if (prev >= 100) { onNavigate(navIndex + 1); return 0; }
          return prev + 3.33;
        });
      }, 100);
    } else {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      setAutoplayProgress(0);
    }
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [autoplay, navIndex, onNavigate]);

  useEffect(() => {
    if (!filmstripRef.current || !item) return;
    const el = document.getElementById(`strip-${item.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [item]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(navIndex + 1);
      if (e.key === 'ArrowRight') onNavigate(navIndex - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navIndex, onClose, onNavigate]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) onNavigate(dx < 0 ? navIndex + 1 : navIndex - 1);
  };

  const filmMouseDown = (e: React.MouseEvent) => {
    filmDrag.current = { active: true, moved: false, startX: e.pageX, scrollLeft: filmstripRef.current?.scrollLeft || 0 };
  };
  const filmMouseMove = useCallback((e: MouseEvent) => {
    if (!filmDrag.current.active || !filmstripRef.current) return;
    const dx = e.pageX - filmDrag.current.startX;
    if (Math.abs(dx) > 4) filmDrag.current.moved = true;
    filmstripRef.current.scrollLeft = filmDrag.current.scrollLeft - dx;
  }, []);
  const filmMouseUp = useCallback(() => {
    filmDrag.current.active = false;
    setTimeout(() => { filmDrag.current.moved = false; }, 50);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', filmMouseMove);
    window.addEventListener('mouseup', filmMouseUp);
    return () => { window.removeEventListener('mousemove', filmMouseMove); window.removeEventListener('mouseup', filmMouseUp); };
  }, [filmMouseMove, filmMouseUp]);

  const copyPrompt = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  if (!item) return null;

  const getImgUrl = (seed: string, w: number, h: number) => `https://picsum.photos/id/${seed}/${w}/${h}`;
  const getAvatarUrl = (img: number) => `https://i.pravatar.cc/150?img=${img}`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 flex overflow-hidden shadow-2xl w-full max-w-[1320px] h-[88vh] max-h-[820px] animate-scaleIn" onClick={(e) => e.stopPropagation()}>

        {/* Filmstrip */}
        <div ref={filmstripRef} className="w-24 shrink-0 bg-black/40 overflow-y-auto p-2 flex flex-col gap-2 cursor-grab select-none max-md:hidden" onMouseDown={filmMouseDown}>
          {navList.map((navItem) => (
            <div key={navItem.id} id={`strip-${navItem.id}`}
              className={`relative rounded-lg overflow-hidden cursor-pointer shrink-0 border-2 transition-all ${navItem.id === item.id ? 'border-purple-500 opacity-100 shadow-lg shadow-purple-500/30' : 'border-transparent opacity-50 hover:opacity-80'}`}
              onClick={() => !filmDrag.current.moved && onNavigate(navList.indexOf(navItem))}>
              <img src={getImgUrl(navItem.seed, 120, 120)} className="w-full h-16 object-cover" alt="" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 left-4 z-50 text-zinc-400 hover:text-white bg-black/50 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* Image stage */}
        <div className="flex-1 bg-black flex items-center justify-center p-4 min-w-0 relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={getImgUrl(item.seed, 900, 900)}
            className={`max-h-full max-w-full object-contain rounded-xl transition-transform duration-200 ${zoomed ? 'scale-[1.9] cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setZoomed(!zoomed)} alt={item.title} />

          <button onClick={(e) => { e.stopPropagation(); onNavigate(navIndex - 1); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors z-30">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNavigate(navIndex + 1); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors z-30">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30 pointer-events-none">
            <span className="pointer-events-auto bg-black/60 text-white text-[11px] font-mono px-2.5 py-1.5 rounded-lg">{navIndex + 1} / {navList.length}</span>
            <div className="pointer-events-auto flex items-center gap-2">
              <button onClick={() => setAutoplay(!autoplay)} className="bg-black/60 text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-black/80">
                {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {autoplay && (
                  <svg className="w-4 h-4 -rotate-90" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <circle cx="10" cy="10" r="8" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="50.24" strokeDashoffset={50.24 - (autoplayProgress / 100) * 50.24} strokeLinecap="round" />
                  </svg>
                )}
                Slideshow
              </button>
              <button className="bg-black/60 text-white text-[11px] px-3 py-1.5 rounded-lg hover:bg-black/80"><Share2 className="w-3.5 h-3.5 inline mr-1" /> Share</button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="overflow-y-auto p-5 md:p-6 flex flex-col gap-5 h-full w-full md:w-[340px] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {item.isNew && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">New</span>}
              {item.trending && <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">Trending</span>}
            </div>
            <h2 className="text-xl font-bold text-white">{item.title}</h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
              <span className="text-yellow-500">{'★'.repeat(Math.round(item.rating))}</span>
              <span>{item.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{item.views} views</span>
              <span>·</span>
              <span className="font-mono">From {item.price}M</span>
            </div>
          </div>

          <div>
            <button onClick={() => copyPrompt(item.prompt)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
            <div className="bg-black border border-zinc-800 rounded-xl p-3 font-mono text-xs text-green-400 leading-relaxed">{item.prompt}</div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Download format</p>
            <div className="flex gap-1.5">
              {['PNG', 'JPG', 'WEBP', 'RAW'].map((fmt) => (
                <button key={fmt} onClick={() => setDownloadFormat(fmt)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${downloadFormat === fmt ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}>
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
            <button className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">Start Collaboration</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> 4K</button>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Team</p>
            <div className="flex items-center gap-2">
              {item.team.slice(0, 4).map((member, idx) => (
                <div key={idx} className="relative group/member">
                  <img src={getAvatarUrl(member.img)} className="w-9 h-9 rounded-full border-2 border-zinc-900" alt={member.name} />
                  <div className="opacity-0 group-hover/member:opacity-100 transition-opacity absolute bottom-full mb-2 right-0 bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-44 shadow-xl text-right z-50 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <img src={getAvatarUrl(member.img)} className="w-9 h-9 rounded-full" alt="" />
                      <div>
                        <p className="text-xs font-bold text-white">{member.name}</p>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{member.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {item.team.length > 4 && (
                <span className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400">+{item.team.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
