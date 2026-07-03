'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';

interface Member {
  name: string;
  role: string;
  img: number;
}

interface AvatarGroupProps {
  members: Member[];
  max?: number;
}

function getAvatarUrl(img: number) {
  return `https://i.pravatar.cc/150?img=${img}`;
}

function AvatarImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (error) return <div className={className} style={{ background: 'linear-gradient(135deg, oklch(65% 0.2 290), oklch(50% 0.15 290))', borderRadius: '9999px' }} />;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setError(true)} decoding="async" />;
}

export default function AvatarGroup({ members, max = 3 }: AvatarGroupProps) {
  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      <div className="avatar-group">
        {visible.map((member, i) => (
          <Tooltip.Root key={member.img + '-' + i}>
            <Tooltip.Trigger asChild>
              <button
                className="avatar-group-item"
                style={{ zIndex: visible.length - i }}
              >
                <AvatarImage
                  src={getAvatarUrl(member.img)}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="avatar-tooltip-content"
                sideOffset={8}
                side="top"
                align="center"
              >
                <div className="avatar-tooltip-inner">
                  <AvatarImage
                    src={getAvatarUrl(member.img)}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="avatar-tooltip-name">{member.name}</p>
                    <p className="avatar-tooltip-role">{member.role}</p>
                  </div>
                </div>
                <Tooltip.Arrow className="avatar-tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}

        {remaining > 0 && (
          <div className="avatar-group-item avatar-group-overflow" style={{ zIndex: 0 }}>
            <span>+{remaining}</span>
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
}
