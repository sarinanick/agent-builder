'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Star, LayoutGrid, Grid3X3, X, Filter, ArrowUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FilmstripModal from './FilmstripModal';
import Sonora from './Sonora';
import { generateItems, ALL_TOOLS, CATEGORIES, type Artwork, type Toast } from './data';

export default function MarketplacePage() {
  // ─── State ──────────────────────────────────────────────────
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

  // Modal state
  const [modalItem, setModalItem] = useState<Artwork | null>(null);
  const [navList, setNavList] = useState<Artwork[]>([]);
  const [navIndex, setNavIndex] = useState(0);

  const itemsPerLoad = 16;
  const searchRef = useRef<HTMLInputElement>(null);

  // ─── Init ───────────────────────────────────────────────────
  useEffect(() => {
    const items = generateItems(150);
    setAllItems(items);
    setLoading(false);
  }, []);

  // ─── Scroll ─────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
      setScrollProgress(isFinite(pct) ? pct : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Keyboard ───────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(true);
      }
      if (e.key === '/' && !cmdkOpen && !modalItem && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setActiveView('explore');
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cmdkOpen, modalItem]);

  // ─── Filter ─────────────────────────────────────────────────
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
      newest: (a, b) => b.createdAt - a.createdAt,
      popular: (a, b) => b.views - a.views,
      rating: (a, b) => b.rating - a.rating,
      price_desc: (a, b) => b.price - a.price,
      price_asc: (a, b) => a.price - b.price,
    };
    items.sort(sorters[sortBy] || sorters.newest);

    setFilteredPool(items);
    setVisibleItems(items.slice(0, itemsPerLoad));
  }, [allItems, searchQuery, selectedTools, selectedCategory, priceRange, minTeamSize, sortBy]);

  useEffect(() => { filterItems(); }, [filterItems]);

  // ─── Load more ──────────────────────────────────────────────
  const loadMore = useCallback(() => {
    setVisibleItems((prev) => {
      const next = filteredPool.slice(prev.length, prev.length + itemsPerLoad);
      return [...prev, ...next];
    });
  }, [filteredPool]);

  // ─── Favorites ──────────────────────────────────────────────
  const toggleFavorite = useCallback((item: Artwork, evt?: React.MouseEvent) => {
    item.liked = !item.liked;
    item.fav = true;
    setAllItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, liked: item.liked } : i)));
    if (item.liked) {
      setFavoritesList((prev) => [...prev, { ...item }]);
      showToast('❤', 'Added to favorites');
      // Spawn particles
      if (evt) {
        const card = (evt.target as HTMLElement).closest('.ai-card');
        if (card) {
          for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const angle = (Math.PI * 2 * i) / 8;
            p.style.setProperty('--tx', `${Math.cos(angle) * 40}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * 40}px`);
            p.style.left = '50%';
            p.style.top = '50%';
            card.appendChild(p);
            setTimeout(() => p.remove(), 650);
          }
        }
      }
    } else {
      setFavoritesList((prev) => prev.filter((f) => f.id !== item.id));
    }
    setTimeout(() => { item.fav = false; }, 300);
  }, []);

  // ─── Compare ────────────────────────────────────────────────
  const toggleCompare = useCallback((item: Artwork) => {
    setCompareList((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.filter((c) => c.id !== item.id);
      if (prev.length >= 3) { showToast('⚠️', 'Max 3 items for comparison'); return prev; }
      return [...prev, item];
    });
  }, []);

  // ─── Toast ──────────────────────────────────────────────────
  const showToast = useCallback((icon: string, msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, icon, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2200);
  }, []);

  // ─── Modal ──────────────────────────────────────────────────
  const openModal = useCallback((item: Artwork) => {
    const list = activeView === 'favorites' ? favoritesList : (filteredPool.length ? filteredPool : allItems);
    setNavList(list);
    setNavIndex(Math.max(0, list.findIndex((i) => i.id === item.id)));
    setModalItem(item);
  }, [activeView, favoritesList, filteredPool, allItems]);

  const navigateModal = useCallback((idx: number) => {
    if (!navList.length) return;
    const newIdx = (idx + navList.length) % navList.length;
    setNavIndex(newIdx);
    setModalItem(navList[newIdx]);
  }, [navList]);

  // ─── Clear filters ──────────────────────────────────────────
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTools([]);
    setSelectedCategory('all');
    setPriceRange(0);
    setMinTeamSize(0);
    setSortBy('newest');
  }, []);

  // ─── Computed ───────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (searchQuery) n++;
    if (selectedTools.length) n += selectedTools.length;
    if (selectedCategory !== 'all') n++;
    if (priceRange > 0) n++;
    if (minTeamSize > 0) n++;
    return n;
  }, [searchQuery, selectedTools, selectedCategory, priceRange, minTeamSize]);

  const favoriteIds = useMemo(() => new Set(favoritesList.map((f) => f.id)), [favoritesList]);

  const cmdkResults = useMemo(() => {
    if (!cmdkQuery) return visibleItems.slice(0, 6);
    const q = cmdkQuery.toLowerCase();
    return allItems.filter((i) => i.title.toLowerCase().includes(q) || i.prompt.toLowerCase().includes(q)).slice(0, 6);
  }, [cmdkQuery, visibleItems, allItems]);

  // ─── Sonora ─────────────────────────────────────────────────
  if (activeView === 'sonora') {
    return <Sonora onBack={() => setActiveView('explore')} showToast={showToast} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 h-0.5 z-[60] transition-[width] duration-75" style={{ width: `${scrollProgress}%`, background: 'linear-gradient(90deg, #a855f7, #f97316)' }} />

      {/* Toasts */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: -12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className="bg-card/80 backdrop-blur-xl border border-border rounded-xl px-4 py-2 text-sm text-foreground flex items-center gap-2 shadow-xl">
              <span>{t.icon}</span> <span>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Navbar />

      {/* Command Palette */}
      <AnimatePresence>
        {cmdkOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] flex items-start justify-center pt-24 px-4" onClick={() => setCmdkOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -8 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search artworks, teams, tools..." value={cmdkQuery} onChange={(e) => setCmdkQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" autoFocus />
                <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">Esc</kbd>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {cmdkResults.map((item) => (
                  <button key={item.id} onClick={() => { openModal(item); setCmdkOpen(false); }}
                    className="w-full text-right flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                    <img src={`https://picsum.photos/seed/${item.seed}/60/60`} className="w-9 h-9 rounded-lg object-cover shrink-0" alt="" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">{item.prompt}</p>
                    </div>
                  </button>
                ))}
                {cmdkResults.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nothing found</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filmstrip Modal */}
      <FilmstripModal item={modalItem} navList={navList} navIndex={navIndex} onClose={() => setModalItem(null)} onNavigate={navigateModal} />

      {/* ─── HOME VIEW ──────────────────────────────────────── */}
      {activeView === 'home' && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 20% 20%, oklch(65% 0.2 290 / 0.25), transparent 40%), radial-gradient(circle at 80% 30%, oklch(70% 0.18 50 / 0.2), transparent 45%)', filter: 'blur(40px)' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> AI-Powered Marketplace
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Freelance Platform for<br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">AI Artisans</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">Collaborate with professional artists using Midjourney, Sora, Runway, and Stable Diffusion</p>
              <button onClick={() => setActiveView('explore')} className="mt-8 px-8 py-3 rounded-xl font-bold text-background bg-foreground hover:opacity-90 transition-opacity">Enter Gallery</button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
              {[{ v: '2.4K', l: 'Active Artists' }, { v: '18K+', l: 'Published Works' }, { v: '4.8', l: 'Average Rating' }].map((s) => (
                <div key={s.l} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                  <p className="text-2xl font-bold text-foreground font-mono">{s.v}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* ─── EXPLORE VIEW ───────────────────────────────────── */}
      {activeView === 'explore' && (
        <div className="max-w-7xl mx-auto flex gap-6 px-6 py-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="bg-card border border-border rounded-xl p-4 space-y-5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input ref={searchRef} type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Filters</h3>
                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-[11px] text-purple-400 hover:text-purple-300">Clear ({activeFilterCount})</button>}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
                    className={`text-[11px] py-2 rounded-lg border transition-colors ${selectedCategory === cat.key ? 'bg-purple-500 text-white border-purple-500' : 'border-border text-muted-foreground hover:border-foreground/20'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TOOLS.map((tool) => (
                    <button key={tool} onClick={() => setSelectedTools((p) => p.includes(tool) ? p.filter((t) => t !== tool) : [...p, tool])}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${selectedTools.includes(tool) ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'border-border text-muted-foreground hover:border-foreground/20'}`}>
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex justify-between"><span>Price (M Tomans)</span><span className="font-mono text-foreground">{priceRange}+</span></p>
                <input type="range" min="0" max="50" step="1" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Min Team Size</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setMinTeamSize(minTeamSize === n ? 0 : n)}
                      className={`text-[11px] w-8 h-8 rounded-lg border transition-colors ${minTeamSize === n ? 'bg-purple-500 text-white border-purple-500' : 'border-border text-muted-foreground hover:border-foreground/20'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-foreground">Explore ({visibleItems.length} / {allItems.length})</h2>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-card border border-border text-foreground text-xs rounded-lg px-3 py-2 outline-none">
                  <option value="newest">Newest</option><option value="popular">Most Popular</option><option value="rating">Highest Rated</option>
                  <option value="price_desc">Most Expensive</option><option value="price_asc">Cheapest</option>
                </select>
                <div className="flex bg-card border border-border rounded-lg p-0.5">
                  <button onClick={() => setDensity('comfortable')} className={`px-2 py-1 rounded text-xs ${density === 'comfortable' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDensity('compact')} className={`px-2 py-1 rounded text-xs ${density === 'compact' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className={`columns-2 md:columns-3 xl:columns-4 gap-3 ${density === 'compact' ? 'xl:columns-5 gap-2' : ''}`}>
              {visibleItems.map((item, index) => (
                <div key={item.id} className="break-inside-avoid mb-3 ai-card group cursor-pointer relative"
                  style={{ animation: `card-in 420ms cubic-bezier(.2,.8,.2,1) ${Math.min(index * 25, 400)}ms both` }}
                  onClick={() => openModal(item)} onDoubleClick={(e) => toggleFavorite(item, e)}>
                  {item.fav && <div className="like-burst"><div className="text-red-500 text-5xl spring-pop">❤</div></div>}
                  <style>{`@keyframes card-in { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
                    .like-burst { position: absolute; inset: 0; pointer-events: none; z-index: 40; display: flex; align-items: center; justify-content: center; }
                    .spring-pop { animation: spring-anim 250ms cubic-bezier(.175,.885,.32,1.275); }
                    @keyframes spring-anim { 0% { transform: scale(.9); opacity: 0; } 60% { transform: scale(1.03); opacity: 1; } 100% { transform: scale(1); } }
                    .particle { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #f97316; animation: burst 600ms ease-out forwards; }
                    @keyframes burst { to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
                  `}</style>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-foreground/10 transition-all duration-200">
                    <div className="relative">
                      <img src={`https://picsum.photos/seed/${item.seed}/400/${item.height}`} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]" alt={item.title} loading="lazy" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.isNew && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">New</span>}
                        {item.trending && <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Trending</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleCompare(item); }}
                        className="absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center text-[10px] font-bold z-20"
                        style={compareList.some((c) => c.id === item.id) ? { background: '#a855f7', borderColor: '#a855f7', color: 'white' } : { background: 'rgba(0,0,0,0.5)', borderColor: '#71717a', color: 'transparent' }}>
                        ✓
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item, e); }}
                        className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Heart className={`h-3.5 w-3.5 ${favoriteIds.has(item.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-mono">{item.duration}</div>
                      {/* Prompt reveal on hover */}
                      <div className="absolute inset-x-0 bottom-0 p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: 'linear-gradient(to top, oklch(10% 0 0 / .95) 0%, transparent 100%)' }}>
                        <p className="font-mono text-xs text-zinc-200 line-clamp-2">{item.prompt}</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-foreground font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono">From {item.price}M</span>
                      </div>
                      {/* Tools */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Tools:</span>
                        <div className="flex gap-1">
                          {item.techs.map((tech) => (
                            <div key={tech.name} className="relative group/tech">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold cursor-pointer hover:scale-110 transition-transform ${tech.className}`}>{tech.icon}</div>
                              <div className="opacity-0 group-hover/tech:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-zinc-700 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-50 pointer-events-none">
                                {tech.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {item.team.slice(0, 3).map((member, idx) => (
                            <div key={idx} className="relative group/member">
                              <img src={`https://i.pravatar.cc/150?img=${member.img}`} className="w-7 h-7 rounded-full border-2 border-card" alt={member.name} />
                              <div className="opacity-0 group-hover/member:opacity-100 transition-opacity absolute bottom-full mb-2 right-0 bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-40 shadow-xl text-right z-50 pointer-events-none">
                                <div className="flex items-center gap-2">
                                  <img src={`https://i.pravatar.cc/150?img=${member.img}`} className="w-8 h-8 rounded-full" alt="" />
                                  <div>
                                    <p className="text-xs font-bold text-white">{member.name}</p>
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{member.role}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {item.team.length > 3 && <span className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-card flex items-center justify-center text-[10px] font-bold text-zinc-400">+{item.team.length - 3}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-tight">{item.teamName}</p>
                          <p className="text-[10px] text-muted-foreground">{item.team.length} members</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleItems.length < filteredPool.length && (
              <div className="py-10 flex justify-center">
                <button onClick={loadMore} className="px-6 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                  Load more ({filteredPool.length - visibleItems.length} remaining)
                </button>
              </div>
            )}

            {visibleItems.length === 0 && !loading && (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No results found</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-purple-400 hover:text-purple-300 underline">Clear filters</button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ─── FAVORITES VIEW ─────────────────────────────────── */}
      {activeView === 'favorites' && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-xl font-bold text-foreground mb-6">My Favorites ({favoritesList.length})</h2>
          {favoritesList.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No favorites yet</p>
              <p className="text-sm mt-2">Double-click on an artwork to save it</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
              {favoritesList.map((item) => (
                <div key={item.id} className="break-inside-avoid mb-3 cursor-pointer" onClick={() => openModal(item)}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200">
                    <img src={`https://picsum.photos/seed/${item.seed}/400/${item.height}`} className="w-full h-auto object-cover" alt={item.title} loading="lazy" />
                    <div className="p-3"><p className="text-sm font-medium text-foreground">{item.title}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      {['home', 'explore', 'favorites'].includes(activeView) && (
        <footer className="border-t border-border mt-10">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">Our artists also work with these tools</h3>
                <p className="text-xs text-muted-foreground mt-1">Three original concept designs — inspired by the vibe, not clones</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Sonora */}
              <button onClick={() => setActiveView('sonora')}
                className="text-right bg-card border border-border rounded-2xl p-5 hover:border-orange-500/40 group transition-all hover:-translate-y-0.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center mb-4 text-white text-lg">🎵</div>
                <p className="font-bold text-white flex items-center gap-2">SONORA <span className="text-[10px] font-normal text-zinc-500">Inspired by Suno</span></p>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">AI music studio — original design concept</p>
                <span className="text-[11px] text-orange-400 mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View <span>←</span></span>
              </button>
              {/* Placeholder 1 */}
              <div className="text-right bg-card border border-border rounded-2xl p-5 opacity-50">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center mb-4 text-white text-lg">🎬</div>
                <p className="font-bold text-white">Coming Soon</p>
                <p className="text-xs text-zinc-500 mt-1.5">Video production suite</p>
              </div>
              {/* Placeholder 2 */}
              <div className="text-right bg-card border border-border rounded-2xl p-5 opacity-50">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-4 text-white text-lg">📸</div>
                <p className="font-bold text-white">Coming Soon</p>
                <p className="text-xs text-zinc-500 mt-1.5">Generative camera control</p>
              </div>
            </div>
            <p className="text-center text-[11px] text-zinc-600 mt-10">© ARTISANS — All pages and brands are original designs.</p>
          </div>
        </footer>
      )}

      {/* Scroll to top */}
      <AnimatePresence>
        {scrolled && ['home', 'explore', 'favorites'].includes(activeView) && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 left-6 z-40 w-11 h-11 rounded-full bg-card/90 backdrop-blur-sm border border-border text-foreground flex items-center justify-center shadow-xl hover:-translate-y-0.5 transition-transform">
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Compare Tray */}
      <AnimatePresence>
        {compareList.length > 0 && ['home', 'explore', 'favorites'].includes(activeView) && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">Compare ({compareList.length}/3):</span>
                {compareList.map((c) => (
                  <div key={c.id} className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
                    <img src={`https://picsum.photos/seed/${c.seed}/40/40`} className="w-6 h-6 rounded object-cover" alt="" />
                    <span className="text-xs text-foreground">{c.title}</span>
                    <button onClick={() => toggleCompare(c)} className="text-muted-foreground hover:text-foreground text-xs ml-1">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCompareList([])} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                <button disabled={compareList.length < 2} onClick={() => showToast('📊', 'Comparison preparing...')}
                  className="bg-purple-600 disabled:opacity-40 text-white text-xs px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {([ { key: 'home' as const, icon: '🏠', label: 'Home' }, { key: 'explore' as const, icon: '🔍', label: 'Explore' }, { key: 'favorites' as const, icon: '❤️', label: 'Favorites' } ]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveView(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${activeView === tab.key ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
