import React from 'react';

interface FarmDeckLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const FarmDeckLogo: React.FC<FarmDeckLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 4-Petal Yellow Emblem matching official logo */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0`}
      >
        {/* Center Petal Assembly */}
        <g transform="translate(50, 50)">
          {/* Top-Left Petal */}
          <path
            d="M 0 0 C -15 -10, -35 -25, -35 -35 C -35 -42, -25 -42, -10 -25 C -5 -15, 0 0, 0 0 Z"
            fill="#FACC15"
          />
          {/* Top-Right Petal */}
          <path
            d="M 0 0 C 10 -15, 25 -35, 35 -35 C 42 -35, 42 -25, 25 -10 C 15 -5, 0 0, 0 0 Z"
            fill="#FACC15"
          />
          {/* Bottom-Left Petal */}
          <path
            d="M 0 0 C -10 15, -25 35, -35 35 C -42 35, -42 25, -25 10 C -15 5, 0 0, 0 0 Z"
            fill="#FACC15"
          />
          {/* Bottom-Right Petal */}
          <path
            d="M 0 0 C 15 10, 35 25, 35 35 C 35 42, 25 42, 10 25 C 5 15, 0 0, 0 0 Z"
            fill="#FACC15"
          />
        </g>
      </svg>

      {/* Brand Text */}
      {showText && (
        <span
          className={`font-serif-title font-bold text-[#2e7d32] tracking-tight leading-none ${textSizes[size]}`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Farmdeck Hub
        </span>
      )}
    </div>
  );
};
