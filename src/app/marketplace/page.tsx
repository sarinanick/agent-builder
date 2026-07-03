'use client';

import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { Search, Heart, Star, LayoutGrid, Grid3X3, X, Filter, ArrowUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { generateItems, ALL_TOOLS, CATEGORIES, type Artwork, type Toast } from './data';

// Lazy load heavy components
const FilmstripModal = lazy(() => import('./FilmstripModal'));
const Sonora = lazy(() => import('./Sonora'));

// ─── Loading fallback ────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'oklch(65% 0.2 290)', borderTopColor: 'transparent' }} />
    </div>
  );
}

// ─── Image with error handling ───────────────────────────────────
function ArtImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);
  if (error) return <div className={className} style={{ ...style, background: 'oklch(18% 0.01 280)' }} />;
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" onError={() => setError(true)} decoding="async" />;
}

function AvatarImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (error) return <div className={className} style={{ background: 'oklch(25% 0.02 290)', borderRadius: '9999px' }} />;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setError(true)} decoding="async" />;
}

export default function MarketplacePage() {
  const [allItems, setAllItems] = useState<Artwork[]>([]);
  const [visibleItems, setVisibleItems] = useState<Artwork[]>([]);
  const [filteredPool, setFilteredPool] = useState<Artwork[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'favorites' | 'sonora'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [priceRange, setPriceRange] = useState(0);
  const [minTeamSize, setMinTeamSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [favoritesList, setFavoritesList] = useState<Artwork[]>([]);
  const [compareList, setCompareList] = useState<Artwork[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [cmdkQuery, setCmdkQuery] = useState('');
  const [modalItem, setModalItem] = useState<Artwork | null>(null);
  const [navList, setNavList] = useState<Artwork[]>([]);
  const [navIndex, setNavIndex] = useState(0);
  const itemsPerLoad = 16;
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const items = generateItems(150); setAllItems(items); setLoading(false); }, []);

  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          const d = document.documentElement;
          const p = d.scrollTop / (d.scrollHeight - d.clientHeight) * 100;
          setScrollProgress(isFinite(p) ? p : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdkOpen(true); }
      if (e.key === '/' && !cmdkOpen && !modalItem && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); setActiveView('explore'); setTimeout(() => searchRef.current?.focus(), 100); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [cmdkOpen, modalItem]);

  const filterItems = useCallback(() => {
    let items = allItems.filter((item) => {
      if (searchQuery && !(item.title.includes(searchQuery) || item.prompt.includes(searchQuery) || item.teamName.includes(searchQuery))) return false;
      if (selectedTools.length && !item.techs.some((t) => selectedTools.includes(t.name))) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (priceRange > 0 && item.price < priceRange) return false;
      if (minTeamSize > 0 && item.team.length < minTeamSize) return false;
      return true;
    });
    const sorters: Record<string, (a: Artwork, b: Artwork) => number> = {
      newest: (a, b) => b.createdAt - a.createdAt, popular: (a, b) => b.views - a.views,
      rating: (a, b) => b.rating - a.rating, price_desc: (a, b) => b.price - a.price, price_asc: (a, b) => a.price - b.price,
    };
    items.sort(sorters[sortBy] || sorters.newest);
    setFilteredPool(items); setVisibleItems(items.slice(0, itemsPerLoad));
  }, [allItems, searchQuery, selectedTools, selectedCategory, priceRange, minTeamSize, sortBy]);
  useEffect(() => { filterItems(); }, [filterItems]);

  const loadMore = useCallback(() => { setVisibleItems((prev) => [...prev, ...filteredPool.slice(prev.length, prev.length + itemsPerLoad)]); }, [filteredPool]);

  const toggleFavorite = useCallback((item: Artwork, evt?: React.MouseEvent) => {
    item.liked = !item.liked;
    setAllItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, liked: item.liked } : i)));
    if (item.liked) {
      setFavoritesList((prev) => [...prev, { ...item }]);
      showToast('❤', 'Added to favorites');
      if (evt) { const card = (evt.target as HTMLElement).closest('.ai-card'); if (card) { for (let i = 0; i < 8; i++) { const p = document.createElement('div'); p.className = 'particle'; const angle = (Math.PI * 2 * i) / 8; p.style.setProperty('--tx', `${Math.cos(angle) * 40}px`); p.style.setProperty('--ty', `${Math.sin(angle) * 40}px`); p.style.left = '50%'; p.style.top = '50%'; card.appendChild(p); setTimeout(() => p.remove(), 650); } } }
    } else { setFavoritesList((prev) => prev.filter((f) => f.id !== item.id)); }
  }, []);

  const toggleCompare = useCallback((item: Artwork) => {
    setCompareList((prev) => { const exists = prev.find((c) => c.id === item.id); if (exists) return prev.filter((c) => c.id !== item.id); if (prev.length >= 3) { showToast('⚠️', 'Max 3 items'); return prev; } return [...prev, item]; });
  }, []);

  const showToast = useCallback((icon: string, msg: string) => {
    const id = Date.now() + Math.random(); setToasts((prev) => [...prev, { id, icon, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2200);
  }, []);

  const openModal = useCallback((item: Artwork) => {
    const list = activeView === 'favorites' ? favoritesList : (filteredPool.length ? filteredPool : allItems);
    setNavList(list); setNavIndex(Math.max(0, list.findIndex((i) => i.id === item.id))); setModalItem(item);
  }, [activeView, favoritesList, filteredPool, allItems]);

  const navigateModal = useCallback((idx: number) => {
    if (!navList.length) return; const newIdx = (idx + navList.length) % navList.length;
    setNavIndex(newIdx); setModalItem(navList[newIdx]);
  }, [navList]);

  const clearFilters = useCallback(() => { setSearchQuery(''); setSelectedTools([]); setSelectedCategory('all'); setPriceRange(0); setMinTeamSize(0); setSortBy('newest'); }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0; if (searchQuery) n++; if (selectedTools.length) n += selectedTools.length;
    if (selectedCategory !== 'all') n++; if (priceRange > 0) n++; if (minTeamSize > 0) n++; return n;
  }, [searchQuery, selectedTools, selectedCategory, priceRange, minTeamSize]);

  const favoriteIds = useMemo(() => new Set(favoritesList.map((f) => f.id)), [favoritesList]);
  const cmdkResults = useMemo(() => {
    if (!cmdkQuery) return visibleItems.slice(0, 6);
    const q = cmdkQuery.toLowerCase();
    return allItems.filter((i) => i.title.toLowerCase().includes(q) || i.prompt.toLowerCase().includes(q)).slice(0, 6);
  }, [cmdkQuery, visibleItems, allItems]);

  const getImgUrl = (seed: string, w: number, h: number) => `https://picsum.photos/id/${seed}/${w}/${h}`;
  const getAvatarUrl = (img: number) => `https://i.pravatar.cc/150?img=${img}`;

  if (activeView === 'sonora') return <Suspense fallback={<Loader />}><Sonora onBack={() => setActiveView('explore')} showToast={showToast} /></Suspense>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--mp-bg, oklch(15% 0.01 280))' }}>
      <style>{`:root { --mp-bg: oklch(15% 0.01 280); --mp-card: oklch(18% 0.01 280); --mp-text: oklch(95% 0 0); --mp-text2: oklch(70% 0 0); --mp-accent: oklch(65% 0.2 290); }`}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 h-[2px] z-[60] transition-[width] duration-75" style={{ width: `${scrollProgress}%`, background: 'linear-gradient(90deg, oklch(65% 0.2 290), oklch(70% 0.18 50))' }} />

      {/* Toasts */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center">
        {toasts.map((t) => (
          <div key={t.id} className="toast-enter rounded-xl px-4 py-2 text-sm text-white flex items-center gap-2 shadow-2xl"
            style={{ background: 'oklch(20% 0.01 280 / .8)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
            <span>{t.icon}</span><span>{t.msg}</span>
          </div>
        ))}
      </div>

      <Navbar />

      {/* Command Palette */}
      {cmdkOpen && (
        <div className="fixed inset-0 z-[65] flex items-start justify-center pt-24 px-4 animate-fadeIn"
          style={{ background: 'oklch(0% 0 0 / .7)', backdropFilter: 'blur(6px)' }} onClick={() => setCmdkOpen(false)}>
          <div className="w-full max-w-xl overflow-hidden shadow-2xl rounded-2xl animate-scaleIn"
            style={{ background: 'oklch(20% 0.01 280 / .8)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'oklch(30% 0 0 / .1)' }}>
              <Search className="h-4 w-4" style={{ color: 'oklch(70% 0 0)' }} />
              <input type="text" placeholder="Search artworks, teams, tools..." value={cmdkQuery} onChange={(e) => setCmdkQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'oklch(95% 0 0)' }} autoFocus />
              <kbd className="text-[10px] border rounded px-1.5 py-0.5 font-mono" style={{ color: 'oklch(50% 0 0)', borderColor: 'oklch(30% 0 0)' }}>Esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {cmdkResults.map((item) => (
                <button key={item.id} onClick={() => { openModal(item); setCmdkOpen(false); }}
                  className="w-full text-right flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: 'oklch(95% 0 0)' }}>
                  <ArtImage src={getImgUrl(item.seed, 60, 60)} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: 'oklch(95% 0 0)' }}>{item.title}</p>
                    <p className="text-[11px] font-mono truncate" style={{ color: 'oklch(50% 0 0)' }}>{item.prompt}</p>
                  </div>
                </button>
              ))}
              {cmdkResults.length === 0 && <p className="text-center py-6" style={{ color: 'oklch(50% 0 0)' }}>Nothing found</p>}
            </div>
          </div>
        </div>
      )}

      {/* Filmstrip Modal */}
      {modalItem && <Suspense fallback={<Loader />}><FilmstripModal item={modalItem} navList={navList} navIndex={navIndex} onClose={() => setModalItem(null)} onNavigate={navigateModal} /></Suspense>}

      {/* ─── HOME ────────────────────────────────────────────── */}
      {activeView === 'home' && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 20% 20%, oklch(65% 0.2 290 / .25), transparent 40%), radial-gradient(circle at 80% 30%, oklch(70% 0.18 50 / .2), transparent 45%)', filter: 'blur(40px)' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{ background: 'oklch(65% 0.2 290 / .1)', border: '1px solid oklch(65% 0.2 290 / .2)', color: 'oklch(75% 0.2 290)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'oklch(65% 0.2 290)' }} /> AI-Powered Marketplace
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: 'oklch(95% 0 0)' }}>
                Freelance Platform for<br />
                <span style={{ background: 'linear-gradient(135deg, oklch(70% 0.2 290), oklch(75% 0.18 330), oklch(70% 0.18 50))', WebkitBackgroundClip: 'text', color: 'transparent' }}>AI Artisans</span>
              </h1>
              <p className="mt-4 max-w-xl mx-auto text-lg" style={{ color: 'oklch(70% 0 0)' }}>Collaborate with professional artists using Midjourney, Sora, Runway, and Stable Diffusion</p>
              <button onClick={() => setActiveView('explore')} className="mt-8 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                style={{ background: 'oklch(95% 0 0)', color: 'oklch(15% 0.01 280)' }}>Enter Gallery</button>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              {[{ v: '2.4K', l: 'Active Artists' }, { v: '18K+', l: 'Published Works' }, { v: '4.8', l: 'Average Rating' }].map((s) => (
                <div key={s.l} className="rounded-2xl p-5" style={{ background: 'oklch(20% 0.01 280 / .5)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                  <p className="text-3xl font-bold font-mono" style={{ color: 'oklch(95% 0 0)' }}>{s.v}</p>
                  <p className="text-xs mt-1" style={{ color: 'oklch(50% 0 0)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── EXPLORE ─────────────────────────────────────────── */}
      {activeView === 'explore' && (
        <div className="max-w-7xl mx-auto flex gap-6 px-6 py-6">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="rounded-2xl p-5 space-y-5" style={{ background: 'oklch(18% 0.01 280 / .7)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'oklch(50% 0 0)' }} />
                <input ref={searchRef} type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg outline-none focus:ring-1" style={{ background: 'oklch(12% 0.01 280)', color: 'oklch(95% 0 0)', border: '1px solid oklch(30% 0 0 / .3)' }} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'oklch(95% 0 0)' }}><Filter className="h-3.5 w-3.5" /> Filters</h3>
                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-[11px] hover:underline" style={{ color: 'oklch(75% 0.2 290)' }}>Clear ({activeFilterCount})</button>}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button key={cat.key} onClick={() => setSelectedCategory(cat.key)} className="text-[11px] py-2 rounded-lg border transition-all"
                    style={selectedCategory === cat.key ? { background: 'oklch(65% 0.2 290)', color: 'white', borderColor: 'oklch(65% 0.2 290)' } : { borderColor: 'oklch(30% 0 0 / .3)', color: 'oklch(70% 0 0)' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs mb-2" style={{ color: 'oklch(50% 0 0)' }}>Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TOOLS.map((tool) => (
                    <button key={tool} onClick={() => setSelectedTools((p) => p.includes(tool) ? p.filter((t) => t !== tool) : [...p, tool])}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg border transition-all"
                      style={selectedTools.includes(tool) ? { background: 'oklch(65% 0.2 290 / .1)', borderColor: 'oklch(65% 0.2 290 / .3)', color: 'oklch(75% 0.2 290)' } : { borderColor: 'oklch(30% 0 0 / .3)', color: 'oklch(70% 0 0)' }}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs mb-2 flex justify-between" style={{ color: 'oklch(50% 0 0)' }}><span>Price (M Tomans)</span><span className="font-mono" style={{ color: 'oklch(70% 0 0)' }}>{priceRange}+</span></p>
                <input type="range" min="0" max="50" step="1" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full" style={{ accentColor: 'oklch(65% 0.2 290)' }} />
              </div>
              <div>
                <p className="text-xs mb-2" style={{ color: 'oklch(50% 0 0)' }}>Min Team Size</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setMinTeamSize(minTeamSize === n ? 0 : n)} className="text-[11px] w-8 h-8 rounded-lg border transition-all"
                      style={minTeamSize === n ? { background: 'oklch(65% 0.2 290)', color: 'white', borderColor: 'oklch(65% 0.2 290)' } : { borderColor: 'oklch(30% 0 0 / .3)', color: 'oklch(70% 0 0)' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'oklch(95% 0 0)' }}>Explore ({visibleItems.length} / {allItems.length})</h2>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs rounded-lg px-3 py-2 outline-none"
                  style={{ background: 'oklch(18% 0.01 280)', color: 'oklch(95% 0 0)', border: '1px solid oklch(30% 0 0 / .3)' }}>
                  <option value="newest">Newest</option><option value="popular">Popular</option><option value="rating">Top Rated</option>
                  <option value="price_desc">Price ↓</option><option value="price_asc">Price ↑</option>
                </select>
                <div className="flex rounded-lg p-0.5" style={{ background: 'oklch(18% 0.01 280)', border: '1px solid oklch(30% 0 0 / .3)' }}>
                  <button onClick={() => setDensity('comfortable')} className="px-2 py-1 rounded text-xs transition-colors"
                    style={density === 'comfortable' ? { background: 'oklch(65% 0.2 290)', color: 'white' } : { color: 'oklch(50% 0 0)' }}><LayoutGrid className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDensity('compact')} className="px-2 py-1 rounded text-xs transition-colors"
                    style={density === 'compact' ? { background: 'oklch(65% 0.2 290)', color: 'white' } : { color: 'oklch(50% 0 0)' }}><Grid3X3 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>

            <div className={`masonry-grid ${density === 'compact' ? 'compact' : ''}`}>
              {visibleItems.map((item, index) => (
                <div key={item.id} className="masonry-item ai-card group cursor-pointer relative enter-item"
                  style={{ animationDelay: `${(index % itemsPerLoad) * 25}ms` }}
                  onClick={() => openModal(item)} onDoubleClick={(e) => toggleFavorite(item, e)}>
                  {item.fav && <div className="like-burst"><div className="text-red-500 text-5xl spring-pop">❤</div></div>}
                  <div className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-2xl"
                    style={{ background: 'oklch(18% 0.01 280 / .7)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                    <div className="relative card-image-container">
                      <ArtImage src={getImgUrl(item.seed, 400, item.height)} alt={item.title} className="artwork w-full h-auto object-cover" />
                      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                        {item.isNew && <span className="badge-new text-white text-[10px] font-bold px-2 py-1 rounded-md">New</span>}
                        {item.trending && <span className="badge-trend text-white text-[10px] font-bold px-2 py-1 rounded-md">Trending</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleCompare(item); }}
                        className="absolute top-3 left-3 z-20 w-6 h-6 rounded-md border-2 flex items-center justify-center text-[10px] font-bold transition-colors"
                        style={compareList.some((c) => c.id === item.id)
                          ? { background: 'oklch(65% 0.2 290)', borderColor: 'oklch(65% 0.2 290)', color: 'white' }
                          : { background: 'oklch(0% 0 0 / .5)', borderColor: 'oklch(50% 0 0)', color: 'transparent' }}>✓</button>
                      <div className="absolute bottom-3 right-3 text-[10px] px-2 py-1 rounded-md font-mono z-10"
                        style={{ background: 'oklch(0% 0 0 / .7)', backdropFilter: 'blur(4px)', color: 'white' }}>{item.duration}</div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item, e); }}
                        className="absolute bottom-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'oklch(0% 0 0 / .7)', backdropFilter: 'blur(4px)' }}>
                        <Heart className={`h-3.5 w-3.5 ${favoriteIds.has(item.id) ? 'text-red-500' : 'text-white'}`} fill={favoriteIds.has(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <div className="prompt-reveal absolute inset-x-0 bottom-0 p-4 z-10">
                        <p className="font-mono text-xs line-clamp-2" style={{ color: 'oklch(85% 0 0)' }}>{item.prompt}</p>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-3" style={{ borderTop: '1px solid oklch(100% 0 0 / .05)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Star className="h-3 w-3 fill-current" style={{ color: 'oklch(70% 0.18 50)' }} />
                          <span style={{ color: 'oklch(95% 0 0)' }}>{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] font-mono" style={{ color: 'oklch(70% 0 0)' }}>From {item.price}M</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] whitespace-nowrap" style={{ color: 'oklch(50% 0 0)' }}>Tools:</span>
                        <div className="flex gap-1">
                          {item.techs.map((tech) => (
                            <div key={tech.name} className="relative group/tech">
                              <div className={`tool-icon w-6 h-6 rounded-md flex items-center justify-center cursor-pointer text-white text-[9px] font-bold hover:scale-110 transition-transform ${tech.className}`}>{tech.icon}</div>
                              <div className="tool-tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-50"
                                style={{ background: 'oklch(0% 0 0)', border: '1px solid oklch(30% 0 0)', color: 'white' }}>{tech.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                            {item.team.slice(0, 3).map((member, idx) => (
                              <div key={idx} className="relative group/member">
                                <AvatarImage src={getAvatarUrl(member.img)} alt={member.name}
                                  className="w-8 h-8 rounded-full border-2 object-cover cursor-pointer" />
                                <div className="artist-tooltip absolute bottom-full mb-2 right-0 rounded-xl p-3 w-44 shadow-2xl text-right z-50"
                                  style={{ background: 'oklch(20% 0.01 280 / .9)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                                  <div className="flex items-center gap-2">
                                    <AvatarImage src={getAvatarUrl(member.img)} alt="" className="w-10 h-10 rounded-full" />
                                    <div>
                                      <p className="text-xs font-bold" style={{ color: 'oklch(95% 0 0)' }}>{member.name}</p>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'oklch(65% 0.2 290 / .2)', color: 'oklch(75% 0.2 290)' }}>{member.role}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {item.team.length > 3 && <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{ background: 'oklch(15% 0.01 280)', border: '2px solid oklch(15% 0.01 280)', color: 'oklch(50% 0 0)' }}>+{item.team.length - 3}</div>}
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight" style={{ color: 'oklch(95% 0 0)' }}>{item.teamName}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'oklch(50% 0 0)' }}>{item.team.length} members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleItems.length < filteredPool.length && (
              <div className="py-10 flex justify-center">
                <button onClick={loadMore} className="px-6 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
                  style={{ background: 'oklch(18% 0.01 280)', border: '1px solid oklch(30% 0 0 / .3)', color: 'oklch(70% 0 0)' }}>
                  Load more ({filteredPool.length - visibleItems.length} remaining)
                </button>
              </div>
            )}
            {visibleItems.length === 0 && !loading && (
              <div className="text-center py-20" style={{ color: 'oklch(50% 0 0)' }}>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No results found</p>
                <button onClick={clearFilters} className="mt-3 text-sm underline" style={{ color: 'oklch(75% 0.2 290)' }}>Clear filters</button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ─── FAVORITES ───────────────────────────────────────── */}
      {activeView === 'favorites' && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'oklch(95% 0 0)' }}>My Favorites ({favoritesList.length})</h2>
          {favoritesList.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'oklch(50% 0 0)' }}>
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No favorites yet</p><p className="text-sm mt-2">Double-click on an artwork to save it</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {favoritesList.map((item) => (
                <div key={item.id} className="masonry-item cursor-pointer" onClick={() => openModal(item)}>
                  <div className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-2xl"
                    style={{ background: 'oklch(18% 0.01 280 / .7)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                    <ArtImage src={getImgUrl(item.seed, 400, item.height)} alt={item.title} className="w-full h-auto object-cover" />
                    <div className="p-3"><p className="text-sm font-bold" style={{ color: 'oklch(95% 0 0)' }}>{item.title}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      {['home', 'explore', 'favorites'].includes(activeView) && (
        <footer style={{ borderTop: '1px solid oklch(100% 0 0 / .05)', marginTop: '2.5rem' }}>
          <div className="max-w-7xl mx-auto px-6 py-14">
            <h3 className="text-lg font-bold mb-1" style={{ color: 'oklch(95% 0 0)' }}>Our artists also work with these tools</h3>
            <p className="text-xs mb-6" style={{ color: 'oklch(50% 0 0)' }}>Original concept designs</p>
            <div className="grid md:grid-cols-3 gap-4">
              <button onClick={() => setActiveView('sonora')}
                className="text-right rounded-2xl p-5 group transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: 'oklch(20% 0.01 280 / .7)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, oklch(75% 0.18 50), oklch(60% 0.19 25))' }}>🎵</div>
                <p className="font-bold flex items-center gap-2" style={{ color: 'oklch(95% 0 0)' }}>SONORA <span className="text-[10px] font-normal" style={{ color: 'oklch(50% 0 0)' }}>Inspired by Suno</span></p>
                <p className="text-xs mt-1.5" style={{ color: 'oklch(50% 0 0)' }}>AI music studio</p>
                <span className="text-[11px] mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: 'oklch(70% 0.18 50)' }}>View ←</span>
              </button>
              <div className="text-right rounded-2xl p-5 opacity-40" style={{ background: 'oklch(18% 0.01 280)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white text-lg" style={{ background: 'linear-gradient(135deg, oklch(55% 0.03 235), oklch(40% 0.03 235))' }}>🎬</div>
                <p className="font-bold" style={{ color: 'oklch(95% 0 0)' }}>Coming Soon</p>
                <p className="text-xs mt-1.5" style={{ color: 'oklch(50% 0 0)' }}>Video production</p>
              </div>
              <div className="text-right rounded-2xl p-5 opacity-40" style={{ background: 'oklch(18% 0.01 280)', border: '1px solid oklch(30% 0 0 / .1)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white text-lg" style={{ background: 'linear-gradient(135deg, oklch(60% 0.24 300), oklch(70% 0.15 200))' }}>📸</div>
                <p className="font-bold" style={{ color: 'oklch(95% 0 0)' }}>Coming Soon</p>
                <p className="text-xs mt-1.5" style={{ color: 'oklch(50% 0 0)' }}>Camera control</p>
              </div>
            </div>
            <p className="text-center text-[11px] mt-10" style={{ color: 'oklch(40% 0 0)' }}>© ARTISANS</p>
          </div>
        </footer>
      )}

      {/* Scroll to top */}
      {scrolled && ['home', 'explore', 'favorites'].includes(activeView) && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 left-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-xl hover:-translate-y-0.5 transition-transform animate-fadeIn"
          style={{ background: 'oklch(20% 0.01 280 / .9)', backdropFilter: 'blur(16px)', border: '1px solid oklch(30% 0 0 / .1)', color: 'oklch(95% 0 0)' }}>
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Compare Tray */}
      {compareList.length > 0 && ['home', 'explore', 'favorites'].includes(activeView) && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-6 py-3 animate-slideUp"
          style={{ background: 'oklch(20% 0.01 280 / .8)', backdropFilter: 'blur(16px)', borderTop: '1px solid oklch(100% 0 0 / .1)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'oklch(80% 0 0)' }}>Compare ({compareList.length}/3):</span>
              {compareList.map((c) => (
                <div key={c.id} className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ background: 'oklch(15% 0.01 280)' }}>
                  <ArtImage src={getImgUrl(c.seed, 40, 40)} alt="" className="w-6 h-6 rounded object-cover" />
                  <span className="text-xs" style={{ color: 'oklch(80% 0 0)' }}>{c.title}</span>
                  <button onClick={() => toggleCompare(c)} className="text-xs ml-1 hover:opacity-70" style={{ color: 'oklch(50% 0 0)' }}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompareList([])} className="text-xs hover:underline" style={{ color: 'oklch(50% 0 0)' }}>Clear</button>
              <button disabled={compareList.length < 2} onClick={() => showToast('📊', 'Comparison preparing...')}
                className="disabled:opacity-40 text-white text-xs px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: 'oklch(65% 0.2 290)' }}>Compare</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ background: 'oklch(18% 0.01 280 / .9)', backdropFilter: 'blur(16px)', borderTop: '1px solid oklch(30% 0 0 / .1)' }}>
        <div className="flex items-center justify-around py-2">
          {([ { key: 'home' as const, icon: '🏠', label: 'Home' }, { key: 'explore' as const, icon: '🔍', label: 'Explore' }, { key: 'favorites' as const, icon: '❤️', label: 'Favorites' } ]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveView(tab.key)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors"
              style={{ color: activeView === tab.key ? 'oklch(95% 0 0)' : 'oklch(50% 0 0)' }}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
