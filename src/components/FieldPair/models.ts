export type FieldPairPropsType = {
  keyExist1: boolean;
  keyValueEqual1: boolean;
  keyExist2: boolean;
  keyValueEqual2: boolean;
  value1?: string | number | (JSX.Element | JSX.Element[])[];
  value2?: string | number | (JSX.Element | JSX.Element[])[];
  key1?: string | number | (JSX.Element | JSX.Element[])[];
  key2?: string | number | (JSX.Element | JSX.Element[])[];
  initialKey1: string;
  initialKey2: string;
  hasChildren: boolean;
  pairKey: string;
  parentKey?: string;
  handleExpand? : (key: string) => void;
  level: number;
  expanded?: boolean;
  initialValue1?: string;
  initialValue2?: string;
};