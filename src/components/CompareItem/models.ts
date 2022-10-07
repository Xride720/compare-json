import { CSSProperties } from "react";
import { IPair } from "../../types/common";

export type PropsType = {
  obj1: IPair<any> | null;
  obj2: IPair<any> | null;
  updateFlag: number;
  searchValue: string | undefined;
};


export type FieldType = {
  key: string;
  value?: string | number;
  children?: FieldType[];
};

export type ItemList = (JSX.Element & {
  children: ItemList | JSX.Element
})[];

export type SearchIndexType = { start: number, end: number};