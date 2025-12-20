import React from "react";

interface IconProps {
  className?: string;
  title?: string;
}

const BaseSvgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 64 64",
};

export const InteriorDesignIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
    <path d="M8 56H56" />
    <path d="M12 56V32C12 32 12 20 24 20H40" />
    <path d="M40 20V56" />
    <path d="M24 20V56" />
    <path d="M40 32H52V56" />
    <path d="M16 12H32" />
    <path d="M48 12L54 18" />
    <circle cx="20" cy="40" r="2" />
  </svg>
);

export const ModellingIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
    <path d="M32 4L4 24L32 44L60 24L32 4Z" />
    <path d="M4 24V48L32 60V44" />
    <path d="M60 24V48L32 60" />
    <path d="M32 44V28" strokeDasharray="4 4" />
    <path d="M4 24L32 28L60 24" strokeDasharray="4 4" opacity={0.5} />
  </svg>
);

export const CommercialIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
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

export const PanoramaIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
    <circle cx="32" cy="32" r="28" strokeDasharray="4 4" />
    <ellipse cx="32" cy="32" rx="28" ry="12" />
    <path d="M32 4V60" strokeDasharray="4 4" />
    <circle cx="32" cy="32" r="6" fill="currentColor" />
    <circle cx="32" cy="32" r="12" strokeWidth={1} />
  </svg>
);

export const RenderingIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
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

export const ProductVisIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg {...BaseSvgProps} className={className} role="img" aria-hidden={!title}>
    {title && <title>{title}</title>}
    <path d="M4 32C4 32 14 12 32 12C50 12 60 32 60 32C60 32 50 52 32 52C14 52 4 32 4 32Z" />
    <circle cx="32" cy="32" r="10" />
    <path d="M8 8H16" strokeWidth={3} />
    <path d="M8 8V16" strokeWidth={3} />
    <path d="M56 8H48" strokeWidth={3} />
    <path d="M56 8V16" strokeWidth={3} />
    <path d="M8 56H16" strokeWidth={3} />
    <path d="M8 56V48" strokeWidth={3} />
    <path d="M56 56H48" strokeWidth={3} />
    <path d="M56 56V48" strokeWidth={3} />
  </svg>
);
