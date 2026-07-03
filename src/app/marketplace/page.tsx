'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, Star, Grid3X3, LayoutGrid, X, ChevronLeft,
  ChevronRight, Filter, SlidersHorizontal, Command
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

// ─── Types ───────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  img: number;
}

interface Tech {
  name: string;
  icon: string;
  class: string;
}

interface Artwork {
  id: number;
  title: string;
  prompt: string;
  seed: number;
  height: number;
  price: number;
  rating: number;
  likes: number;
  category: string;
  tools: string[];
  team: TeamMember[];
  teamName: string;
  isNew: boolean;
  trending: boolean;
  duration: string;
  liked: boolean;
}

// ─── Data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all', label: 'همه' },
  { key: 'image', label: 'تصویر' },
  { key: 'video', label: 'ویدیو' },
  { key: 'music', label: 'موسیقی' },
  { key: '3d', label: 'سه‌بعدی' },
  { key: 'text', label: 'متن' },
];

const ALL_TOOLS = ['Midjourney', 'Sora', 'Runway', 'Stable Diffusion', 'DALL-E', 'ElevenLabs', 'Suno'];

const generateItems = (): Artwork[] => {
  const items: Artwork[] = [];
  const titles = [
    'پرتره سایبرپانک', 'منظره خیالی', 'طراحی لوگو', 'انیمیشن موشن', 'موسیقی الکترونیک',
    'ویدیو کلیپ', 'مدل سه‌بعدی', 'تصویرسازی دیجیتال', 'پوستر تبلیغاتی', 'کاراکتر بازی',
    'فضای داخلی', 'طراحی بسته‌بندی', 'موکاپ اپلیکیشن', 'ویدیو تبلیغاتی', 'آهنگ پاپ',
    'جلد آلبوم', 'نقاشی دیجیتال', 'ایموجی سفارشی', 'ویدیو موشن', 'پادکست',
  ];
  const prompts = [
    'A cyberpunk portrait with neon lights and rain...',
    'Ethereal landscape with floating islands...',
    'Modern minimalist logo design...',
    'Smooth motion graphics animation...',
    'Electronic music with deep bass...',
    'Cinematic video clip with drone shots...',
    'Detailed 3D model of futuristic vehicle...',
    'Digital illustration of a warrior...',
    'Professional poster design...',
    'Game character concept art...',
  ];
  const categories = ['image', 'video', 'music', '3d', 'text'];
  const teamNames = ['تیم نئون', 'استودیو کیهان', 'آتلیه پیکسل', 'تیم امواج', 'استودیو نور'];

  for (let i = 0; i < 20; i++) {
    items.push({
      id: i + 1,
      title: titles[i % titles.length],
      prompt: prompts[i % prompts.length],
      seed: 100 + i * 7,
      height: 200 + (i % 5) * 80,
      price: Math.floor(Math.random() * 45) + 5,
      rating: 3.5 + Math.random() * 1.5,
      likes: Math.floor(Math.random() * 500) + 10,
      category: categories[i % categories.length],
      tools: [ALL_TOOLS[i % ALL_TOOLS.length], ALL_TOOLS[(i + 2) % ALL_TOOLS.length]],
      team: [
        { name: `هنرمند ${i + 1}`, role: 'طراح اصلی', img: (i % 20) + 1 },
        { name: `دستیار ${i + 1}`, role: 'توسعه‌دهنده', img: ((i + 5) % 20) + 1 },
      ],
      teamName: teamNames[i % teamNames.length],
      isNew: i < 4,
      trending: i % 3 === 0,
      duration: `${Math.floor(Math.random() * 30) + 5} روز`,
      liked: false,
    });
  }
  return items;
};

// ─── Main Component ──────────────────────────────────────────────
export default function MarketplacePage() {
  const [allItems, setAllItems] = useState<Artwork[]>([]);
  const [visibleItems, setVisibleItems] = useState<Artwork[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'favorites'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [priceRange, setPriceRange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState<Artwork | null>(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize items
  useEffect(() => {
    const items = generateItems();
    setAllItems(items);
    setVisibleItems(items);
    setLoading(false);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdkOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdkOpen(false);
        setModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Filter items
  const filterItems = useCallback(() => {
    let filtered = [...allItems];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.prompt.toLowerCase().includes(q) ||
          item.teamName.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedTools.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTools.some((tool) => item.tools.includes(tool))
      );
    }

    if (priceRange > 0) {
      filtered = filtered.filter((item) => item.price >= priceRange);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setVisibleItems(filtered);
  }, [allItems, searchQuery, selectedCategory, selectedTools, sortBy, priceRange]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  }, []);

  const toggleTool = useCallback((tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTools([]);
    setPriceRange(0);
    setSortBy('newest');
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    count += selectedTools.length;
    if (priceRange > 0) count++;
    return count;
  }, [selectedCategory, selectedTools, priceRange]);

  const favoriteItems = useMemo(
    () => allItems.filter((item) => favorites.has(item.id)),
    [allItems, favorites]
  );

  const cmdkResults = useMemo(() => {
    if (!searchQuery) return visibleItems.slice(0, 6);
    return visibleItems.slice(0, 6);
  }, [searchQuery, visibleItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-orange-500 z-[60] transition-[width] duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* Command Palette */}
      <AnimatePresence>
        {cmdkOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] flex items-start justify-center pt-24 px-4"
            onClick={() => setCmdkOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search artworks, teams, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">Esc</kbd>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {cmdkResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setModalItem(item); setCmdkOpen(false); }}
                    className="w-full text-right flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <img
                      src={`https://picsum.photos/seed/${item.seed}/60/60`}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">{item.prompt}</p>
                    </div>
                  </button>
                ))}
                {cmdkResults.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">Nothing found</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artwork Modal */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${modalItem.seed}/800/600`}
                  className="w-full h-80 object-cover rounded-t-xl"
                  alt={modalItem.title}
                />
                <button
                  onClick={() => setModalItem(null)}
                  className="absolute top-3 left-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-mono">
                  {modalItem.duration}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{modalItem.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{modalItem.teamName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{modalItem.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-mono bg-muted rounded-lg p-3">{modalItem.prompt}</p>
                <div className="flex flex-wrap gap-2">
                  {modalItem.tools.map((tool) => (
                    <span key={tool} className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground border border-border">
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    {modalItem.team.slice(0, 3).map((member, idx) => (
                      <img
                        key={idx}
                        src={`https://i.pravatar.cc/150?img=${member.img}`}
                        className="w-8 h-8 rounded-full border-2 border-card"
                        alt={member.name}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">{modalItem.team.length} members</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">From {modalItem.price}M Tomans</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(modalItem.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      favorites.has(modalItem.id)
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-muted text-muted-foreground border border-border hover:border-foreground/20'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(modalItem.id) ? 'fill-current' : ''}`} />
                    {favorites.has(modalItem.id) ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-foreground text-background hover:opacity-90 transition-opacity">
                    Contact Team
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HOME VIEW ──────────────────────────────────────── */}
      {activeView === 'home' && (
        <div className="relative overflow-hidden">
          {/* Mesh background */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 20% 20%, oklch(65% 0.2 290 / 0.25), transparent 40%), radial-gradient(circle at 80% 30%, oklch(70% 0.18 50 / 0.2), transparent 45%), radial-gradient(circle at 50% 80%, oklch(65% 0.2 290 / 0.15), transparent 50%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                AI-Powered Marketplace
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Freelance Platform for
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  AI Artisans
                </span>
              </h1>

              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
                Collaborate with professional artists using Midjourney, Sora, Runway, and Stable Diffusion
              </p>

              <button
                onClick={() => setActiveView('explore')}
                className="mt-8 px-8 py-3 rounded-xl font-bold text-background bg-foreground hover:opacity-90 transition-opacity"
              >
                Enter Gallery
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16"
            >
              {[
                { value: '2.4K', label: 'Active Artists' },
                { value: '18K+', label: 'Published Works' },
                { value: '4.8', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                  <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
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
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[11px] text-purple-400 hover:text-purple-300">
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`text-[11px] py-2 rounded-lg border transition-colors ${
                      selectedCategory === cat.key
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'border-border text-muted-foreground hover:border-foreground/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tools */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                        selectedTools.includes(tool)
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : 'border-border text-muted-foreground hover:border-foreground/20'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex justify-between">
                  <span>Price Range (M Tomans)</span>
                  <span className="font-mono text-foreground">{priceRange}+</span>
                </p>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-foreground">
                Explore ({visibleItems.length} / {allItems.length})
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-card border border-border text-foreground text-xs rounded-lg px-3 py-2 outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_desc">Most Expensive</option>
                  <option value="price_asc">Cheapest</option>
                </select>
                <div className="flex bg-card border border-border rounded-lg p-0.5">
                  <button
                    onClick={() => setDensity('comfortable')}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      density === 'comfortable' ? 'bg-foreground text-background' : 'text-muted-foreground'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDensity('compact')}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      density === 'compact' ? 'bg-foreground text-background' : 'text-muted-foreground'
                    }`}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Masonry Grid */}
            <div
              className={`columns-2 md:columns-3 xl:columns-4 gap-3 ${
                density === 'compact' ? 'xl:columns-5 gap-2' : ''
              }`}
            >
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                  className="break-inside-avoid mb-3 group cursor-pointer"
                  onClick={() => setModalItem(item)}
                >
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-foreground/10 transition-all duration-200">
                    {/* Badges */}
                    <div className="relative">
                      <img
                        src={`https://picsum.photos/seed/${item.seed}/400/${item.height}`}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        alt={item.title}
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.isNew && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            New
                          </span>
                        )}
                        {item.trending && (
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Trending
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className={`h-3.5 w-3.5 ${favorites.has(item.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                        {item.duration}
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-foreground font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono">From {item.price}M</span>
                      </div>

                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>

                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {item.team.slice(0, 2).map((member, idx) => (
                            <img
                              key={idx}
                              src={`https://i.pravatar.cc/150?img=${member.img}`}
                              className="w-6 h-6 rounded-full border-2 border-card"
                              alt={member.name}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">{item.teamName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {visibleItems.length === 0 && !loading && (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No results found</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-purple-400 hover:text-purple-300 underline">
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ─── FAVORITES VIEW ─────────────────────────────────── */}
      {activeView === 'favorites' && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-xl font-bold text-foreground mb-6">
            My Favorites ({favoriteItems.length})
          </h2>
          {favoriteItems.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No favorites yet</p>
              <p className="text-sm mt-2">Double-click on an artwork to save it</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-3 cursor-pointer"
                  onClick={() => setModalItem(item)}
                >
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200">
                    <img
                      src={`https://picsum.photos/seed/${item.seed}/400/${item.height}`}
                      className="w-full h-auto object-cover"
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── BOTTOM NAV (Mobile) ────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {[
            { key: 'home' as const, label: 'Home', icon: '🏠' },
            { key: 'explore' as const, label: 'Explore', icon: '🔍' },
            { key: 'favorites' as const, label: 'Favorites', icon: '❤️' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${
                activeView === tab.key ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
