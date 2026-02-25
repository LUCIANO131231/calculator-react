import { useEffect, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import ButtonGrid from "@/components/ButtonGrid";
import Display from "@/components/Display";
import HistoryPanel from "@/components/HistoryPanel";


export default function Calculator() {
  const {
    state,
    clear,
    backspace,
    toggleAngleMode,
    inputDigit,
    inputOperator,
    calculate,
    inputScientific,
    toggleSign,
    percent,
    clearHistory,
    useHistoryResult,
  } = useCalculator();

  const [sciMode, setSciMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // teclado
  useEffect(() => {
    const map: Record<string, () => void> = {
      "0": () => inputDigit("0"),
      "1": () => inputDigit("1"),
      "2": () => inputDigit("2"),
      "3": () => inputDigit("3"),
      "4": () => inputDigit("4"),
      "5": () => inputDigit("5"),
      "6": () => inputDigit("6"),
      "7": () => inputDigit("7"),
      "8": () => inputDigit("8"),
      "9": () => inputDigit("9"),
      ".": () => inputDigit("."),
      ",": () => inputDigit("."),
      "+": () => inputOperator("+"),
      "-": () => inputOperator("−"),
      "*": () => inputOperator("×"),
      "/": () => inputOperator("÷"),
      "Enter": calculate,
      "=": calculate,
      "Backspace": backspace,
      "Escape": clear,
      "%": percent,
    };
  const handler = (e: KeyboardEvent) => {
      const fn = map[e.key];
      if (fn) { e.preventDefault(); fn(); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
}, [inputDigit, inputOperator, calculate, backspace, clear, percent]);

return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 w-full max-w-sm">

        {/* Toolbar */}
        <div className="flex justify-between items-center px-1">
          <button
            onClick={() => setSciMode((s) => !s)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
              sciMode
                ? "bg-amber-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {sciMode ? "Básica" : "Científica"}
          </button>

          <button
            onClick={() => setShowHistory((s) => !s)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
              showHistory
                ? "bg-amber-400 text-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {showHistory ? "Cerrar" : `📋 ${state.history.length > 0 ? state.history.length : ""}`}
          </button>
        </div>

        {/* Historial */}
        {showHistory && (
          <HistoryPanel
            history={state.history}
            onUseResult={(r) => { useHistoryResult(r); setShowHistory(false); }}
            onClear={clearHistory}
          />
        )}

        {/* Calculadora */}
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black">
          <Display
            value={state.display}
            expression={state.expression}
            angleMode={state.angleMode}
            isError={state.isError}
          />
          <ButtonGrid
            onDigit={inputDigit}
            onOperator={inputOperator}
            onCalculate={calculate}
            onClear={clear}
            onBackspace={backspace}
            onScientific={inputScientific}
            onToggleSign={toggleSign}
            onPercent={percent}
            onToggleAngle={toggleAngleMode}
            angleMode={state.angleMode}
            sciMode={sciMode}
          />
        </div>

      </div>
    </div>
  );
}