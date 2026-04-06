'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold text-red-600">Une erreur est survenue</h2>
      <p className="text-slate-500 mt-2">Impossible de communiquer avec la base de données.</p>
      <button 
        onClick={() => reset()} 
        className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold"
      >
        Réessayer
      </button>
    </div>
  );
}