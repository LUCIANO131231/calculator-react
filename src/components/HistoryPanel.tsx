import type { HistoryEntry } from "@/types/Calculator";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onUseResult: (result: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onUseResult, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-zinc-900 rounded-3xl overflow-hidden flex flex-col max-h-96">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h2 className="text-white font-medium text-sm tracking-wide">
          Historial
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-amber-400 text-xs font-medium hover:text-amber-300 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* lista */}
      <div className="overflow-y-auto flex-1 px-4 py-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="text-4xl">🕐</span>
            <p className="text-zinc-500 text-sm">Sin historial aún</p>
          </div>
        ) : (
          history.map((entry, i) => (
            <button
              key={i}
              onClick={() => onUseResult(entry.result)}
              className="w-full text-right px-4 py-3 rounded-2xl mb-2 hover:bg-zinc-800 transition-colors group"
            >
              {/* expresion */}
              <p className="text-zinc-500 text-xs font-light mb-1 group-hover:text-zinc-400 transition-colors">
                {entry.expression}
              </p>
              {/* resultado */}
              <p className="text-white text-xl font-light">
                = {entry.result}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}