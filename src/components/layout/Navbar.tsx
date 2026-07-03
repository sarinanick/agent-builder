'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Navbar() {
  const pathname = usePathname();
  const { lang } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMarketplace = pathname.startsWith('/marketplace');
  const isBuilder = pathname === '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">ARTISANS</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isBuilder ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
              <Bot className="h-3.5 w-3.5" />
              {lang === 'fa' ? 'سازنده ایجنت' : 'Agent Builder'}
            </Link>
            <Link href="/marketplace" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isMarketplace ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
              <Store className="h-3.5 w-3.5" />
              {lang === 'fa' ? 'بازار' : 'Marketplace'}
            </Link>
            <LanguageToggle />
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden overflow-hidden border-t border-border animate-slideDown">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isBuilder ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
              <Bot className="h-3.5 w-3.5" />
              {lang === 'fa' ? 'سازنده ایجنت' : 'Agent Builder'}
            </Link>
            <Link href="/marketplace" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isMarketplace ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
              <Store className="h-3.5 w-3.5" />
              {lang === 'fa' ? 'بازار' : 'Marketplace'}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
