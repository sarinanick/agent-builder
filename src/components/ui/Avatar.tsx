'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

export function Avatar({ src, alt, size = 'md', fallback, className = '' }: AvatarProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-full font-medium ${sizeClasses[size]} ${className}`}
        style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

interface AvatarGroupProps {
  avatars: { src?: string; alt: string }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 3, size = 'md' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full font-medium ${sizeClasses[size]}`}
          style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)', border: '2px solid white' }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
