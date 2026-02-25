import type { AngleMode } from "@/types/Calculator";
import { formatDisplay } from "@/utils/Calculator";

interface DisplayProps {
  value: string;
  expression: string;
  angleMode: AngleMode;
  isError: boolean;
}

export default function Display ({ value, expression, angleMode, isError}: DisplayProps) {
  const fontSize =
    value.length > 13 ? "text-3xl" :
    value.length > 9 ? "text-4xl" :
    "text-6xl";

  return (
    <div className="flex flex-col justify-end px-6 pt-8 pb-5 min-h-44 select-none">
      {/* Badge DEG / RAD */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold tracking-widest text-violet-400 bg-violet-500/15 border border-violet-500/20 px-3 py-1 rounded-full">
          {angleMode}
        </span>
      </div>

      {/* Expresión secundaria */}
      <div className="text-right text-sm text-white/30 font-light min-h-5 mb-1 truncate">
        {expression}
      </div>

      {/* Display principal */}
      <div className={`text-right font-thin tracking-tight leading-none transition-all duration-150 ${fontSize} ${isError ? "text-red-400" : "text-white"}`}>
        {isError ? "Error" : formatDisplay(value)}
      </div>
    </div>
  );
}