import React, { useEffect, useState } from 'react';

export default function AgeGateModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('age_verified')) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white max-w-sm w-full rounded-xl p-6 text-center border border-zinc-700">
        <h2 className="text-xl font-bold mb-2">Conteúdo para maiores</h2>
        <p className="text-sm text-zinc-300 mb-4">Este site contém conteúdo adulto. Confirme sua idade.</p>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            onClick={() => { localStorage.setItem('age_verified', '1'); setOpen(false); }}
          >
            Tenho 18+
          </button>
          <a className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg" href="https://google.com">
            Sair
          </a>
        </div>
      </div>
    </div>
  );
}


