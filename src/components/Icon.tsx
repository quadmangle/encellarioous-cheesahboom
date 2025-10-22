import React from 'react';
import type { IconName } from '../types';

type IconDefinition = {
  viewBox: string;
  content: React.ReactNode;
};

const ICONS: Record<IconName, IconDefinition> = {
  square: {
    viewBox: '0 0 24 24',
    content: <rect x={4} y={4} width={16} height={16} rx={4} ry={4} fill="none" stroke="currentColor" strokeWidth={2} />,
  },
  chat: {
    viewBox: '0 0 24 24',
    content: (
      <path
        d="M5 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-3.8L10 19.2V15H8a3 3 0 0 1-3-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    ),
  },
  'user-plus': {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={11} cy={8} r={4} />
        <path d="M4 20c0-3.5 3.6-6 7-6s7 2.5 7 6" />
        <path d="M19 6v6" />
        <path d="M16 9h6" />
      </g>
    ),
  },
  envelope: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
        <rect x={3} y={5} width={18} height={14} rx={2} />
        <path d="M3 7l9 7 9-7" />
      </g>
    ),
  },
  close: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M5 5l14 14" />
        <path d="M19 5L5 19" />
      </g>
    ),
  },
  plus: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </g>
    ),
  },
  home: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 11v10h14V11" />
        <path d="M9 21v-6h6v6" />
      </g>
    ),
  },
  layers: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
        <path d="m12 4 9 5-9 5-9-5Z" />
        <path d="m4 14 8 4 8-4" />
        <path d="m4 18 8 4 8-4" />
      </g>
    ),
  },
  search: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={10.5} cy={10.5} r={6.5} />
        <path d="m15.5 15.5 5 5" />
      </g>
    ),
  },
  microphone: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x={9} y={4} width={6} height={12} rx={3} />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 19v4" />
      </g>
    ),
  },
  'check-circle': {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={9} />
        <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
      </g>
    ),
  },
  expand: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H5v4" />
        <path d="M15 5h4v4" />
        <path d="M19 15v4h-4" />
        <path d="M9 19H5v-4" />
      </g>
    ),
  },
  'paper-plane': {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
        <path d="m3 5 18 7-18 7 4-7Z" />
        <path d="m11 12 10 0" />
      </g>
    ),
  },
  lock: {
    viewBox: '0 0 24 24',
    content: (
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x={5} y={11} width={14} height={10} rx={2} />
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <path d="M12 16v2" />
      </g>
    ),
  },
};

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const icon = ICONS[name];

  if (!icon) {
    return null;
  }

  return (
    <svg
      className={className}
      viewBox={icon.viewBox}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {icon.content}
    </svg>
  );
};

export default Icon;
