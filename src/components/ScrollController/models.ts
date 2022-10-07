import { FieldPairPropsType } from "../FieldPair/models";

export type TriggerScrollType = ((e: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;

export type PropsType = {
  updateRef: React.MutableRefObject<(() => void) | undefined>;
  listItemsCount: number;
  settings: SettingsScrollType;
  getItems: (offset: number, limit: number) => any[];
  renderItems: (pair: FieldPairPropsType) => JSX.Element;
  viewportHeight: number;
  defaultPaddingTop?: number;
  defaultPaddingBottom?: number;
};

export type SettingsScrollType = {
  itemHeight: number,
  tolerance: number,
  minIndex: number,
  maxIndex: number,
  startIndex?: number
};