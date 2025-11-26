
import React from 'react';

interface IconProps {
  className?: string;
}

export const InteriorDesignIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 56H56" />
    <path d="M12 56V32C12 32 12 20 24 20H40" />
    <path d="M40 20V56" />
    <path d="M24 20V56" />
    <path d="M40 32H52V56" />
    <path d="M16 12H32" strokeLinecap="round" />
    <path d="M48 12L54 18" strokeLinecap="round" />
    <circle cx="20" cy="40" r="2" />
  </svg>
);

export const ModellingIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M32 4L4 24L32 44L60 24L32 4Z" />
    <path d="M4 24V48L32 60V44" />
    <path d="M60 24V48L32 60" />
    <path d="M32 44V28" strokeDasharray="4 4" />
    <path d="M4 24L32 28L60 24" strokeDasharray="4 4" opacity="0.5" />
  </svg>
);

export const CommercialIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="16" y="12" width="32" height="48" />
    <path d="M8 60H56" />
    <rect x="22" y="20" width="6" height="8" />
    <rect x="36" y="20" width="6" height="8" />
    <rect x="22" y="36" width="6" height="8" />
    <rect x="36" y="36" width="6" height="8" />
    <path d="M16 12L32 4L48 12" />
    <path d="M52 12H58V60" />
    <path d="M6 60V40H16" />
  </svg>
);

export const SpacePlanningIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="8" width="48" height="48" rx="2" />
    <path d="M8 20H56" />
    <path d="M24 20V56" />
    <path d="M40 20V40H56" />
    <path d="M48 8V20" />
    <path d="M14 14L18 14" />
    <path d="M24 56V62" strokeWidth="3" />
    <path d="M56 56V62" strokeWidth="3" />
  </svg>
);

export const RenderingIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="32" cy="32" r="24" />
    <circle cx="32" cy="32" r="16" />
    <circle cx="32" cy="32" r="8" />
    <path d="M32 4V12" />
    <path d="M32 52V60" />
    <path d="M4 32H12" />
    <path d="M52 32H60" />
    <path d="M48 16L44 20" />
  </svg>
);

export const ProductVisIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 32C4 32 14 12 32 12C50 12 60 32 60 32C60 32 50 52 32 52C14 52 4 32 4 32Z" />
    <circle cx="32" cy="32" r="10" />
    <path d="M8 8L16 8" strokeWidth="3" />
    <path d="M8 8L8 16" strokeWidth="3" />
    <path d="M56 8L48 8" strokeWidth="3" />
    <path d="M56 8L56 16" strokeWidth="3" />
    <path d="M8 56L16 56" strokeWidth="3" />
    <path d="M8 56L8 48" strokeWidth="3" />
    <path d="M56 56L48 56" strokeWidth="3" />
    <path d="M56 56L56 48" strokeWidth="3" />
  </svg>
);
