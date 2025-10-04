import React from 'react';

export default function NSFWBlurImage({ children }) {
  return (
    <div className="relative group">
      <div className="blur-[4px] group-hover:blur-0 transition duration-300">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
          Conteúdo sensível
        </span>
      </div>
    </div>
  );
}


