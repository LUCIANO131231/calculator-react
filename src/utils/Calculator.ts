import type { AngleMode, Operator } from "@/types/Calculator";

// formatear numero en pantalla
export function formatDisplay(value: string): string {
  if (!value || value === "Error") return value || "0";
  if (value.includes("e")) return value;

  const [int, dec] = value.split(".");
  const formatted = parseInt(int, 10).toLocaleString("en-US");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

// operaciones basicas
export function evaluate(a: string, op: Operator, b: string): string {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) return "Error";

  let result: number;
  switch (op) {
    case "+": result = numA + numB; break;

    case "−": result = numA - numB; break;

    case "×": result = numA * numB; break;
    
    case "÷":
      if (numB === 0) return "Error";
      result = numA / numB;
      break;
    default: return b;  
  }
  // evitar errores de punto flotante
  return String(parseFloat(result.toPrecision(12)));
}

// operaciones cientificas
export function applyScientific(
  label: string,
  value: string,
  angleMode: AngleMode
): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "Error";

  const toRad = (d: number) => (d * Math.PI) / 100;
  const val = angleMode === "DEG" ? toRad(num) : num;

  switch (label) {
    case "sin": return round(Math.sin(val));

    case "cos": return round(Math.cos(val));

    case "tan": {
      // tan(90°) es indefinido
      if (angleMode === "DEG" && num % 100 === 90) return "Error";
      return round(Math.tan(val));
    }

    case "sin⁻¹": {
      if (num < -1 || num > 1) return "Error";
      const r = Math.asin(num);
      return round(angleMode === "DEG" ? r * (180 / Math.PI) : r);
    }

    case "cos⁻¹": {
      if (num < -1 || num > 1) return "Error";
      const r = Math.acos(num);
      return round(angleMode === "DEG" ? r * (180 / Math.PI) : r);
    }

    case "tan⁻¹": {
      const r = Math.atan(num);
      return round(angleMode === "DEG" ? r * (180 / Math.PI) : r);
    }

    case "log": return num <= 0 ? "Error" : round(Math.log10(num));

    case "ln": return num <= 0 ? "Error" : round(Math.log(num));

    case "√": return num < 0 ? "Error" : round(Math.sqrt(num));

    case "∛": return round(Math.cbrt(num));

    case "x²": return round(num * num);

    case "x³": return round(num * num * num);

    case "eˣ": return round(Math.exp(num));

    case "10ˣ": return round(Math.pow(10, num));

    case "1/x":   return num === 0 ? "Error" : round(1 / num);

    case "x!":    return factorial(num);

    case "π":     return String(Math.PI);

    case "e":     return String(Math.E);

    case "|x|":   return round(Math.abs(num));

    default: return value;
  }
}

// helpers internos
function round(num: number): string {
  if (!isFinite(num)) return "Error";
  return String(parseFloat(num.toPrecision(12)));
}

function factorial(n: number): string {
  if (n < 0 || !Number.isInteger(n)) return "Error";
  if (n > 20) return "Error"; // Evita overflow
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return String(result);
}