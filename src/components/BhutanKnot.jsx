import React from 'react';

export const BhutanKnot = ({ className = 'w-8 h-8', color = '#9e1b27', secondaryColor = '#d97706' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer auspicious diamond knot */}
      <path
        d="M50 8 L92 50 L50 92 L8 50 Z"
        stroke={secondaryColor}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
      {/* Endless Knot Interlacing Bands */}
      <path
        d="M50 18 L76 44 L64 56 L50 42 L36 56 L24 44 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="2"
      />
      <path
        d="M50 82 L24 56 L36 44 L50 58 L64 44 L76 56 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="2"
      />
      <path
        d="M18 50 L44 24 L56 36 L42 50 L56 64 L44 76 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="2"
      />
      <path
        d="M82 50 L56 76 L44 64 L58 50 L44 36 L56 24 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="2"
      />
      {/* Central Diamond Core */}
      <polygon points="50,38 62,50 50,62 38,50" fill={secondaryColor} />
    </svg>
  );
};
