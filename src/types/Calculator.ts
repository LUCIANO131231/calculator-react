export type Operator = '+' | '-' | '*' | '/' | null;

export type AngleMode = 'DEG' | 'RAD';

export interface HistoryEntry {
  expression: string;
  result: string;
}

export interface CalculatorState {
  display: string;
  expression: string;
  operator: Operator;
  prevValue: string | null;
  waiting: boolean;
  justCalc: boolean;
  angleMode: AngleMode;
  history: HistoryEntry[];
  isError: boolean;
}