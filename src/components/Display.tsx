import { formatDisplay } from "../utils/Calculator";


interface DisplayProps {
  value: string;
  expression: string;
  angleMode: "DEG" | "RAD";
  isError: boolean;
}

export default function Display ({ value, expression, angleMode, isError}: DisplayProps) {
  const fontSize =
    value.length > 13 ? "text-3xl" :
    value.length > 9 ? "text-4xl" :
    "text-6xl";

  return (
    <div className="bg-black rounded-t-3xl px-6 pt-10 pb-4 select-none">
      {/* Badge DEG / RAD */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-zinc-500 font-medium tracking-widest">
          {angleMode}
        </span>
      </div>

      {/* Expresión secundaria */}
      <div className="text-right text-zinc-500 text-sm font-light min-h-5 mb-1 truncate">
        {expression}
      </div>

      {/* Display principal */}
      <div className={`text-right font-light tracking-tight transition-all duration-150 ${fontSize} ${isError ? "text-red-400" : "text-white"}`}>
        {isError ? "Error" : formatDisplay(value)}
      </div>
    </div>
  );
}