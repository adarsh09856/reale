import React from 'react';

export const BhutanPattern = ({ className = 'h-3 w-full' }) => {
  return (
    <div className={`overflow-hidden ${className} bg-[#85131e] relative`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1200 24"
      >
        <defs>
          <pattern id="bhutanTextile" width="48" height="24" patternUnits="userSpaceOnUse">
            {/* Base Crimson */}
            <rect width="48" height="24" fill="#9e1b27" />
            {/* Diamond Golden Thread */}
            <polygon points="24,0 48,12 24,24 0,12" fill="#d97706" />
            <polygon points="24,3 42,12 24,21 6,12" fill="#b91c1c" />
            {/* Inner Turquoise & Emerald Accents */}
            <polygon points="24,6 36,12 24,18 12,12" fill="#047857" />
            <polygon points="24,9 30,12 24,15 18,12" fill="#f59e0b" />
            {/* Corner Crosses */}
            <rect x="0" y="0" width="4" height="24" fill="#0f172a" opacity="0.4" />
            <rect x="44" y="0" width="4" height="24" fill="#0f172a" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bhutanTextile)" />
      </svg>
    </div>
  );
};
