
import React from 'react';

interface IconProps {
  className?: string;
}

export const MinimizeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14h6v6m10-10h-6V4m0 6l6-6m-10 10l-6 6" />
  </svg>
);
