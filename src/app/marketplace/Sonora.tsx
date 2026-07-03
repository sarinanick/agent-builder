'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { SONORA_PLACEHOLDERS, SONORA_GENRES, SONORA_TRACKS, SONORA_FEATURES, type Track } from './data';

interface SonoraProps {
  onBack: () => void;
  showToast: (icon: string, msg: string) => void;
}

export default function Sonora({ onBack, showToast }: SonoraProps) {
  const [promptText, setPromptText] = useState('');
  const [showGhost, setShowGhost] = useState(true);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(SONORA_TRACKS);
  const [waveBars, setWaveBars] = useState<{ h: number; dur: string; delay: string }[]>([]);

  // Init wave bars
  useEffect(() => {
    setWaveBars(
      Array.from({ length: 48 }, () => ({
        h: 10 + Math.random() * 46,
        dur: (0.8 + Math.random() * 0.8).toFixed(2),
        delay: (Math.random() * 1).toFixed(2),
      }))
    );
  }, []);

  // Rotate placeholders
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % SONORA_PLACEHOLDERS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const generate = () => {
    if (generating) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast('🎶', 'Your song is ready!');
    }, 1500);
  };

  const playTrack = (track: Track) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === track.id ? { ...t, playing: !t.playing } : { ...t, playing: false }
      )
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% -10%, oklch(24% 0.05 50 / .5), transparent 55%), oklch(13% 0.02 45)' }}>
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" /> Back to Artisans
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Unbounded, sans-serif', color: 'oklch(78% 0.16 75)' }}>SONORA</div>
        <button onClick={() => showToast('🎧', 'Added to waitlist')} className="text-xs font-bold px-4 py-2 rounded-full text-black" style={{ background: 'linear-gradient(135deg, oklch(66% 0.19 25), oklch(78% 0.16 75))' }}>
          Start Free
        </button>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-16 text-center">
        <span className="text-[11px] tracking-[0.25em] font-bold" style={{ fontFamily: 'Unbounded, sans-serif', color: 'oklch(78% 0.16 75)' }}>SONORA STUDIO — AI MUSIC</span>
        <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight" style={{ fontFamily: 'Unbounded, sans-serif', color: 'oklch(96% 0 0)' }}>
          Turn any idea into a<br />
          <span style={{ background: 'linear-gradient(135deg, oklch(66% 0.19 25), oklch(78% 0.16 75))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            complete song
          </span>
        </h1>
        <p className="mt-5 max-w-lg mx-auto text-sm" style={{ color: 'oklch(65% 0.02 45)' }}>
          Just describe the mood you want; Sonora creates melody, instrumentation, and vocals in seconds.
        </p>

        {/* Prompt bar */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="flex items-center gap-2 px-2 py-2 rounded-full" style={{ background: 'oklch(17% 0.02 45)', border: '1px solid oklch(45% 0.02 45 / .4)' }}>
            <div className="relative flex-1">
              <input
                type="text"
                value={promptText}
                onChange={(e) => { setPromptText(e.target.value); setShowGhost(false); }}
                onFocus={() => setShowGhost(false)}
                onBlur={() => { if (!promptText) setShowGhost(true); }}
                className="w-full bg-transparent outline-none text-sm py-2.5 px-4"
                style={{ color: 'oklch(96% 0 0)' }}
              />
              {showGhost && !promptText && (
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-sm overflow-hidden whitespace-nowrap" style={{ color: 'oklch(65% 0.02 45)', maxWidth: '88%' }}>
                  {SONORA_PLACEHOLDERS[placeholderIdx]}
                </div>
              )}
            </div>
            <button
              onClick={generate}
              className="shrink-0 text-xs font-bold px-5 py-2.5 rounded-full text-black flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, oklch(78% 0.16 75), oklch(66% 0.19 25))' }}
            >
              {generating ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Genre pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {SONORA_GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                className={`text-xs px-3.5 py-2 rounded-full border transition-all ${
                  selectedGenre === g
                    ? 'font-bold text-black border-transparent'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
                style={selectedGenre === g ? { background: 'linear-gradient(135deg, oklch(78% 0.16 75), oklch(66% 0.19 25))' } : {}}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Waveform */}
        <div className="flex items-end justify-center gap-1 h-16 mt-12">
          {waveBars.map((bar, i) => (
            <div
              key={i}
              className="w-[5px] rounded-sm"
              style={{
                height: `${bar.h}px`,
                background: 'linear-gradient(to top, oklch(66% 0.19 25), oklch(78% 0.16 75))',
                animation: `sonora-bounce ${bar.dur}s ease-in-out infinite`,
                animationDelay: `${bar.delay}s`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
          <style>{`@keyframes sonora-bounce { 0%,100% { transform: scaleY(.25); } 50% { transform: scaleY(1); } }`}</style>
        </div>
      </header>

      {/* Trending Tracks */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'Unbounded, sans-serif', color: 'oklch(96% 0 0)' }}>Trending Tracks This Week</h2>
        <div className="rounded-2xl p-2 md:p-3" style={{ background: 'oklch(17% 0.02 45)', border: '1px solid oklch(30% 0.02 45 / .4)' }}>
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
              onClick={() => playTrack(track)}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, oklch(78% 0.16 75), oklch(66% 0.19 25))', color: 'oklch(15% 0 0)' }}>
                {track.playing ? (
                  <div className="flex items-end gap-[2px] h-3.5">
                    <span className="w-[3px] bg-black rounded-sm" style={{ animation: 'sonora-eq .8s ease-in-out infinite', height: '30%' }} />
                    <span className="w-[3px] bg-black rounded-sm" style={{ animation: 'sonora-eq .8s ease-in-out infinite', height: '30%', animationDelay: '.15s' }} />
                    <span className="w-[3px] bg-black rounded-sm" style={{ animation: 'sonora-eq .8s ease-in-out infinite', height: '30%', animationDelay: '.3s' }} />
                  </div>
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'oklch(96% 0 0)' }}>{track.title}</p>
                <p className="text-xs" style={{ color: 'oklch(65% 0.02 45)' }}>{track.genre}</p>
              </div>
              <span className="text-xs hidden sm:flex items-center gap-1" style={{ color: 'oklch(65% 0.02 45)' }}>
                ❤ {track.likes}
              </span>
              <span className="text-xs font-mono" style={{ color: 'oklch(65% 0.02 45)' }}>{track.duration}</span>
            </div>
          ))}
          <style>{`@keyframes sonora-eq { 0%,100% { height: 30%; } 50% { height: 100%; } }`}</style>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-4">
          {SONORA_FEATURES.map((f) => (
            <div key={f.title} className="p-5 rounded-2xl" style={{ background: 'oklch(17% 0.02 45)', border: '1px solid oklch(30% 0.02 45 / .4)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg" style={{ background: 'oklch(78% 0.16 75)', color: 'oklch(15% 0 0)' }}>{f.icon}</div>
              <p className="font-bold text-sm" style={{ color: 'oklch(96% 0 0)' }}>{f.title}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'oklch(65% 0.02 45)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold" style={{ fontFamily: 'Unbounded, sans-serif', color: 'oklch(96% 0 0)' }}>Create your first song now</h3>
        <button onClick={() => showToast('🎵', 'Welcome to Sonora')} className="mt-6 text-sm font-bold px-8 py-3 rounded-full text-black" style={{ background: 'linear-gradient(135deg, oklch(78% 0.16 75), oklch(66% 0.19 25))' }}>
          Start Free
        </button>
      </section>
    </div>
  );
}
