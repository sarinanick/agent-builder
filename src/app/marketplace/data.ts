// ─── Types ───────────────────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  img: number;
}

export interface Tech {
  name: string;
  icon: string;
  className: string;
}

export interface Artwork {
  id: number;
  seed: string;
  height: number;
  title: string;
  prompt: string;
  techs: Tech[];
  category: string;
  duration: string;
  teamName: string;
  team: TeamMember[];
  fav: boolean;
  liked: boolean;
  rating: number;
  price: number;
  views: number;
  isNew: boolean;
  trending: boolean;
  createdAt: number;
}

export interface Track {
  id: number;
  title: string;
  genre: string;
  duration: string;
  likes: string;
  playing: boolean;
}

export interface Toast {
  id: number;
  icon: string;
  msg: string;
}

// ─── Tool Icons ──────────────────────────────────────────────────
export const TOOL_ICONS: Record<string, { icon: string; className: string; cat: string }> = {
  Midjourney: { className: 'bg-gradient-to-br from-violet-600 to-indigo-700', icon: 'MJ', cat: 'image' },
  Runway: { className: 'bg-gradient-to-br from-emerald-500 to-teal-600', icon: 'RW', cat: 'video' },
  Sora: { className: 'bg-gradient-to-br from-sky-400 to-blue-600', icon: 'SR', cat: 'video' },
  'Stable Diffusion': { className: 'bg-gradient-to-br from-amber-500 to-rose-600', icon: 'SD', cat: 'model3d' },
};

export const ALL_TOOLS = ['Midjourney', 'Sora', 'Runway', 'Stable Diffusion'];

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Image' },
  { key: 'video', label: 'Video' },
  { key: 'model3d', label: '3D' },
];

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Ali Rezaei', role: 'Prompt Engineer', img: 12 },
  { name: 'Sara Ahmadi', role: '3D Artist', img: 5 },
  { name: 'Reza Ghasemi', role: 'Retoucher', img: 15 },
  { name: 'Nia Karimi', role: 'AI Artist', img: 32 },
];

const TEAM_NAMES = ['Nebula Collective', 'Cyber Creators', 'AI Dreamers', 'Pixel Pioneers'];

const TECH_OPTIONS = [
  ['Midjourney', 'Runway'],
  ['Sora', 'Stable Diffusion'],
  ['Midjourney'],
  ['Stable Diffusion'],
  ['Sora'],
];

export function generateItems(count: number): Artwork[] {
  const items: Artwork[] = [];
  for (let i = 1; i <= count; i++) {
    const teamSize = Math.floor(Math.random() * 4) + 1;
    const team: TeamMember[] = [];
    for (let j = 0; j < teamSize; j++) team.push(TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)]);

    const seconds = Math.floor(Math.random() * 60);
    const duration = `00:${seconds.toString().padStart(2, '0')}`;
    const toolNames = TECH_OPTIONS[Math.floor(Math.random() * TECH_OPTIONS.length)];
    const techs: Tech[] = toolNames.map((n) => ({ name: n, icon: TOOL_ICONS[n].icon, className: TOOL_ICONS[n].className }));

    items.push({
      id: i, seed: `prod-${i}`, height: Math.floor(Math.random() * 400) + 300,
      title: `AI Concept #${i}`, prompt: `surreal landscape, sci-fi city, highly detailed, ${i} --ar 16:9`,
      techs, category: TOOL_ICONS[toolNames[0]].cat, duration,
      teamName: TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)], team,
      fav: false, liked: false, rating: +(3 + Math.random() * 2).toFixed(1),
      price: Math.floor(Math.random() * 45) + 2, views: Math.floor(Math.random() * 5000),
      isNew: Math.random() > 0.85, trending: Math.random() > 0.9, createdAt: count - i,
    });
  }
  return items;
}

// ─── Sonora ──────────────────────────────────────────────────────
export const SONORA_PLACEHOLDERS = [
  'A pop song about a summer evening in the north...',
  'A calm lo-fi piece for late night study...',
  'An epic cinematic theme with choir and full orchestra...',
  'A high-energy electronic track for driving...',
  'A traditional ballad with tar and setar...',
];

export const SONORA_GENRES = ['Pop', 'Lo-fi', 'Cinematic', 'Electronic', 'Traditional', 'Rock'];

export const SONORA_TRACKS: Track[] = [
  { id: 1, title: 'Golden Hour Drift', genre: 'Lo-fi', duration: '2:48', likes: '1.2k', playing: false },
  { id: 2, title: 'Blue Nights', genre: 'Persian Pop', duration: '3:15', likes: '980', playing: false },
  { id: 3, title: 'Neon Skyline', genre: 'Electronic', duration: '3:02', likes: '2.4k', playing: false },
  { id: 4, title: 'Echoes of Tabriz', genre: 'Traditional Fusion', duration: '4:10', likes: '640', playing: false },
  { id: 5, title: 'Velvet Static', genre: 'Rock', duration: '3:33', likes: '1.5k', playing: false },
  { id: 6, title: 'Epic Horizon', genre: 'Cinematic', duration: '5:02', likes: '3.1k', playing: false },
];

export const SONORA_FEATURES = [
  { title: 'Endless Genre Variety', desc: 'From pop to cinematic, create any mood with a single prompt.', icon: '📊' },
  { title: 'Natural Singer Voice', desc: 'Vocals and melody in harmony with the emotion of your text.', icon: '🎤' },
  { title: 'Real-time Editing', desc: 'Rebuild any section of the song independently.', icon: '✏️' },
  { title: 'Studio-quality Output', desc: 'High-quality files ready for professional release.', icon: '⬇️' },
];
