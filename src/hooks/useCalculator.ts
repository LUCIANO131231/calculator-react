import { useState, useCallback } from "react";
import type { CalculatorState, Operator } from "@/types/Calculator";
import { applyScientific, evaluate } from "@/utils/Calculator";


const initialState: CalculatorState = {
  display: "0",
  expression: "",
  operator: null,
  prevValue: null,
  waiting: false,
  justCalc: false,
  angleMode: "DEG",
  history: [],
  isError: false,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const update = (partial: Partial<CalculatorState>) =>
    setState((s) => ({ ...s, ...partial }));

  //clear
  const clear = useCallback(() => setState(initialState), []);

  //backspace
  const backspace = useCallback(() => {
    setState((s) => {
      if (s.justCalc || s.isError) return { ...s, display: "0", isError:false, justCalc: false };
      const next = s.display.length > 1 ? s.display.slice(0, -1) : "0";
      return { ...s, display: next };
    });
  }, []);

  // toggle angulo DEG/RAD
  const toggleAngleMode = useCallback(() => {
    setState((s) => ({
      ...s,
      angleMode: s.angleMode === "DEG" ? "RAD" : "DEG",
    }));
  }, []);

  // digito
  const inputDigit = useCallback((digit: string) => {
    setState((s) => {
      if (s.isError) return s;
      if (s.waiting || s.justCalc) {
        return { ...s, display: digit, waiting: false, justCalc: false };
      }
      if (s.display === "0" && digit !== ".") {
        return { ...s, display: digit };
      }
      if (digit === "." && s.display.includes(".")) return s;
      if (s.display.replace("-", "").replace(".", "").length >= 12) return s;
      return { ...s, display: s.display + digit };
    });
  }, []);

  // operador basico
  const inputOperator = useCallback((op: Operator) => {
    setState((s) => {
      if (s.isError) return s;

      // Si ya hay un operador pendiente, calculamos primero
      if (s.operator && !s.waiting && s.prevValue !== null) {
        const result = evaluate(s.prevValue, s.operator, s.display);
        if(result === "Error") return { ...s, display: "Error", isError: true};
        return {
          ...s,
          display: result,
          prevValue: result,
          operator: op,
          expression: `${result} ${op}`,
          waiting: true,
          justCalc: false,
        };
      }

      return {
        ...s,
        prevValue: s.display,
        operator: op,
        expression: `${s.display} ${op}`,
        waiting: true,
        justCalc: false,
      };
    });
  }, []);

  // igual
  const calculate = useCallback(() => {
    setState((s) => {
      if (!s.operator || s.prevValue === null || s.isError) return s;

      const secondValue = s.waiting ? s.prevValue : s.display;
      const result = evaluate(s.prevValue, s.operator, secondValue);
      const expr = `${s.prevValue} ${s.operator} ${secondValue}`;

      if (result === "Error") {
        return { ...s, display: "Error", expression: `${expr} =`, isError: true};
      }

      const entry = { expression: expr, result};
      return {
        ...s,
        display: result,
        expression: `${expr} =`,
        operator: null,
        prevValue: null,
        waiting: false,
        justCalc: true,
        isError: false,
        history: [entry, ...s.history].slice(0, 30),
      };
    });
  }, []);

  // cientifica
  const inputScientific = useCallback((label: string) => {
    setState((s) => {
      if (s.isError && label !== "C") return s;

      const result = applyScientific(label, s.display, s.angleMode);
      if (result === "Error") {
        return { ...s, display: "Error", isError: true };
      }

      return {
        ...s,
        display: result,
        expression: `${label}(${s.display})`,
        justCalc: true,
        isError: false,
      };
    });
  }, []);

  // signo
  const toggleSign = useCallback(() => {
    setState((s) => {
      if (s.display === "0" || s.isError) return s;
      const toggled = s.display.startsWith("-")
        ? s.display.slice(1)
        : `-${s.display}`;
      return { ...s, display: toggled};
    });
  }, []);

  // porcentaje
  const percent = useCallback(() => {
    setState((s) => {
      const num = parseFloat(s.display);
      if (isNaN(num)) return s;
      const result = String(parseFloat((num / 100).toPrecision(12)));
      return { ...s, display: result, justCalc: true};
    });
  }, []);

  // limpiar historial
  const clearHistory = useCallback(() => {
    update({ history: []});
  }, []);

  // usar resultado del historial
  const useHistoryResult = useCallback((result: string) => {
    update ({ display: result, justCalc: true, isError: false});
  }, []);

  return {
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
  };
}