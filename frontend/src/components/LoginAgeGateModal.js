import React, { useEffect, useState } from 'react';

export default function LoginAgeGateModal() {
  const [open, setOpen] = useState(true);

  const handleConfirm = () => {
    setOpen(false);
  };

  const handleReject = () => {
    window.location.href = 'https://google.com';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-zinc-900 text-white max-w-md w-full rounded-2xl p-8 text-center border-2 border-rose-500/50 shadow-2xl mx-4">
        {/* Icon */}
        <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔞</span>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 text-rose-500">Verificação de Idade</h2>
        
        {/* Description */}
        <p className="text-base text-zinc-300 mb-2">
          Este site contém conteúdo adulto (+18).
        </p>
        <p className="text-sm text-zinc-400 mb-6">
          Você confirma que tem 18 anos ou mais?
        </p>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            onClick={handleConfirm}
          >
            ✓ Tenho 18+ anos
          </button>
          <button
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            onClick={handleReject}
          >
            ✗ Sair
          </button>
        </div>
        
        {/* Warning */}
        <div className="mt-6 p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg">
          <p className="text-xs text-zinc-400">
            ⚠️ Ao continuar, você declara estar ciente da natureza adulta do conteúdo
          </p>
        </div>
      </div>
    </div>
  );
}

