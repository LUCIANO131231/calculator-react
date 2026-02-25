import { useCallback, useState } from "react";
import type { AngleMode } from "../types/Calculator";


interface ButtonGridProps {
  onDigit: (d: string) => void;
  onOperator: (op: any) => void;
  onCalculate: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onScientific: (label: string) => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onToggleAngle: () => void;
  angleMode: AngleMode;
  sciMode: boolean;
}

// tipos de boton
type BtnVariant = "digit" | "operator" | "action" | "scientific" | "equals";

interface BtnConfig {
  label: string;
  variant: BtnVariant;
  action: string;
  wide?: boolean;
}

// layout cientifico
const SCI_ROWS: BtnConfig[][] = [
  [
    { label: "DEG", variant: "scientific", action: "toggleAngle" },
    { label: "sin",  variant: "scientific", action: "sci" },
    { label: "cos",  variant: "scientific", action: "sci" },
    { label: "tan",  variant: "scientific", action: "sci" },
    { label: "π",    variant: "scientific", action: "sci" },
  ],
  [
    { label: "2ⁿᵈ",  variant: "scientific", action: "second" },
    { label: "log",  variant: "scientific", action: "sci" },
    { label: "ln",   variant: "scientific", action: "sci" },
    { label: "eˣ",   variant: "scientific", action: "sci" },
    { label: "e",    variant: "scientific", action: "sci" },
  ],
  [
    { label: "x²",   variant: "scientific", action: "sci" },
    { label: "x³",   variant: "scientific", action: "sci" },
    { label: "√",    variant: "scientific", action: "sci" },
    { label: "∛",    variant: "scientific", action: "sci" },
    { label: "1/x",  variant: "scientific", action: "sci" },
  ],
  [
    { label: "|x|",  variant: "scientific", action: "sci" },
    { label: "x!",   variant: "scientific", action: "sci" },
    { label: "10ˣ",  variant: "scientific", action: "sci" },
    { label: "(",    variant: "scientific", action: "sci" },
    { label: ")",    variant: "scientific", action: "sci" },
  ],
];

// layout basico estilo iphone
const BASIC_ROWS: BtnConfig[][] = [
  [
    { label: "C",   variant: "action",   action: "clear" },
    { label: "+/-", variant: "action",   action: "sign" },
    { label: "%",   variant: "action",   action: "percent" },
    { label: "÷",   variant: "operator", action: "op" },
  ],
  [
    { label: "7", variant: "digit", action: "digit" },
    { label: "8", variant: "digit", action: "digit" },
    { label: "9", variant: "digit", action: "digit" },
    { label: "×", variant: "operator", action: "op" },
  ],
  [
    { label: "4", variant: "digit", action: "digit" },
    { label: "5", variant: "digit", action: "digit" },
    { label: "6", variant: "digit", action: "digit" },
    { label: "−", variant: "operator", action: "op" },
  ],
  [
    { label: "1", variant: "digit", action: "digit" },
    { label: "2", variant: "digit", action: "digit" },
    { label: "3", variant: "digit", action: "digit" },
    { label: "+", variant: "operator", action: "op" },
  ],
  [
    { label: "0",  variant: "digit",  action: "digit", wide: true },
    { label: ".",  variant: "digit",  action: "digit" },
    { label: "=",  variant: "equals", action: "calc" },
  ],
];

// estilos por variante
function getStyle(variant: BtnVariant, label: string): string {
  const base = "flex items-center justify-center rounded-full font-light select-none cursor-pointer active:scale-95 transition-transform duration-100";

  switch (variant) {
    case "digit":
      return `${base} bg-zinc-700 hover:bg-zinc-600 text-white text-2xl`;
    case "operator":
      return `${base} bg-amber-400 hover:bg-amber-300 text-black text-3xl font-medium`;
    case "equals":
      return `${base} bg-amber-400 hover:bg-amber-300 text-black text-3xl font-medium`;
    case "action":
      return `${base} bg-zinc-400 hover:bg-zinc-300 text-black text-xl font-medium`;
    case "scientific":
      return label === "DEG" || label === "RAD"
        ? `${base} bg-zinc-600 hover:bg-zinc-500 text-amber-400 text-xs font-semibold`
        : `${base} bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium`;
    default:
      return base;
  }
}

// boton individual
interface CalcButtonProps {
  config: BtnConfig;
  second: boolean;
  angleMode: AngleMode;
  onPress: (config: BtnConfig) => void;
  size: number; // px
}

function CalcButton({ config, second, angleMode, onPress, size }: CalcButtonProps) {
  // swap funciones
  const displayLabel = (() => {
    if (!second) return config.label === "DEG" || config.label === "RAD" ? angleMode : config.label;
    const swaps: Record<string, string> = {
      sin: "sin⁻¹", cos: "cos⁻¹", tan: "tan⁻¹",
      log: "10ˣ",   ln: "eˣ",     "eˣ": "ln",
      "x²": "√",    "x³": "∛",    "√": "x²",
    };
    return swaps[config.label] ?? config.label;
  })();

  const effectiveConfig = second && displayLabel !== config.label
    ? { ...config, label: displayLabel }
    : config;

  return (
    <button
      className={`${getStyle(config.variant, config.label)} ${config.wide ? "col-span-2" : ""}`}
      style={{
        width: config.wide ? size * 2 + 12 : size,
        height: size,
        fontSize: config.variant === "scientific" ? 13 : undefined,
      }}
      onClick={() => onPress(effectiveConfig)}
    >
      {displayLabel}
    </button>
  );
}

// grid principal
export default function ButtonGrid({
  onDigit, onOperator, onCalculate, onClear,
  onBackspace, onScientific, onToggleSign,
  onPercent, onToggleAngle, angleMode, sciMode,
}: ButtonGridProps) {
  const [second, setSecond] = useState(false);

  const btnSize = sciMode ? 58 : 72;

  const handlePress = useCallback((config: BtnConfig) => {
    switch (config.action) {
      case "digit":       return onDigit(config.label);
      case "op":          return onOperator(config.label);
      case "calc":        return onCalculate();
      case "clear":       return onClear();
      case "backspace":   return onBackspace();
      case "sign":        return onToggleSign();
      case "percent":     return onPercent();
      case "toggleAngle": return onToggleAngle();
      case "second":      return setSecond((s) => !s);
      case "sci":         return onScientific(config.label);
    }
  }, [onDigit, onOperator, onCalculate, onClear, onBackspace, onScientific, onToggleSign, onPercent, onToggleAngle]);

  const rows = sciMode ? [...SCI_ROWS, ...BASIC_ROWS] : BASIC_ROWS;

  return (
    <div className="bg-black px-4 pb-8 pt-4 rounded-b-3xl flex flex-col gap-3">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-3 justify-center">
          {row.map((btn) => (
            <CalcButton
              key={btn.label}
              config={btn}
              second={second}
              angleMode={angleMode}
              onPress={handlePress}
              size={btnSize}
            />
          ))}
        </div>
      ))}
    </div>
  );
}