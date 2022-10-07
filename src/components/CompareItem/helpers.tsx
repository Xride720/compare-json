import React, { CSSProperties } from "react";
import { IPair } from "../../types/common";
import { FieldPairPropsType } from "../FieldPair/models";
import { FieldType, SearchIndexType } from "./models";

export const buildFieldsArr = (obj: IPair<any>): FieldType[] => {
  const result = Array.from(Object.entries(obj));
  result.sort((a, b) => a[0] > b[0] ? 1 : -1);
  return result
    .map(([key, value]: [string, any]) => ({
        key,
        value: (typeof value === "string" || typeof value === "number" ?
          value
          : JSON.stringify(value)) + "  (type=" + typeof value + ")",
      })
    );
  };

const getSearchIndexArr = (
  str: string, 
  searchValue: string, 
  arr: SearchIndexType[],
  delta: number = 0): SearchIndexType[] => {
  const searchIndex = {
    start: str.indexOf(searchValue) + delta,
    end: str.indexOf(searchValue) + searchValue.length + delta
  };
  const newStr = str.substring(searchIndex.end);
  
  return newStr.indexOf(searchValue) !== -1 ? 
    getSearchIndexArr(
      newStr, 
      searchValue, 
      [...arr, searchIndex], 
      searchIndex.end + delta
    ) 
    : [...arr, searchIndex];
};

const getIntersection = (searchIndexArr: SearchIndexType[], indexStart: number, indexEnd: number ): SearchIndexType[] => {
  return searchIndexArr.filter(item => {
    const searchIndexStart = item.start;
    const searchIndexEnd = item.end;
    if (indexStart <= searchIndexStart && indexEnd >= searchIndexEnd) { // ...."....str...."....
      return true;
    } else if (indexStart > searchIndexStart && indexEnd >= searchIndexEnd && indexStart < searchIndexEnd) {// ....s"tr...."....
      return true;
    } else if (indexStart <= searchIndexStart && indexEnd < searchIndexEnd && indexEnd > searchIndexStart) {// ...."....s"tr...
      return true;
    } else if (
      indexStart >= searchIndexStart
      && indexStart < searchIndexEnd
      && indexEnd <= searchIndexEnd
      && indexEnd > searchIndexStart
    ) return true;
    return false;
  });
}

export const buildCompareString = (str1: string, str2: string, searchValue: string): (JSX.Element | JSX.Element[])[] | string => {
  const styleSearched: CSSProperties = {
    background: "#a8000085",
  };
  const isSearched = str1.indexOf(searchValue) !== -1 && searchValue;
  
  const searchIndexArr = isSearched ? getSearchIndexArr(str1, searchValue, []) : [];
  const buildStr = (equal: boolean, indexStart: number, indexEnd: number ): JSX.Element | JSX.Element[] => {
    if (isSearched) {
      const indexArr = getIntersection(searchIndexArr, indexStart, indexEnd);
      if (indexArr.length) {
        return indexArr.map((item, i, arr) => {
          const next = arr[i + 1];
          const prev = arr[i - 1];
          const searchIndexStart = item.start;
          const searchIndexEnd = item.end;
          if (indexStart > searchIndexStart && indexEnd >= searchIndexEnd && indexStart < searchIndexEnd) {// ....s"tr...."....
            const str_1 = str1.substring(indexStart, searchIndexEnd);
            const str_2 = str1.substring(searchIndexEnd, next ? next.start : indexEnd);
            return (
              <span key={indexStart + "-" + indexEnd + "-" + i} style={{ color: equal ? "#12c312" : "#ff4f4f" }}>
                <span style={styleSearched}>{str_1}</span>
                <span>{str_2}</span>
              </span>
            );
          } else if (indexStart <= searchIndexStart && indexEnd >= searchIndexEnd) { // ...."....str...."....
            const str_1 = str1.substring(prev ? searchIndexStart: indexStart, searchIndexStart);
            const str_2 = str1.substring(searchIndexStart, searchIndexEnd);
            const str_3 = str1.substring(searchIndexEnd, next ? next.start : indexEnd);
            return (
              <span key={indexStart + "-" + indexEnd + "-" + i} style={{ color: equal ? "#12c312" : "#ff4f4f" }}>
                <span>{str_1}</span>
                <span style={styleSearched}>{str_2}</span>
                <span>{str_3}</span>
              </span>
            );
          } else if (indexStart <= searchIndexStart && indexEnd < searchIndexEnd && indexEnd > searchIndexStart) {// ...."....s"tr...
            const str_1 = str1.substring(prev ? searchIndexStart : indexStart, searchIndexStart);
            const str_2 = str1.substring(searchIndexStart, indexEnd);
            return (
              <span key={indexStart + "-" + indexEnd + "-" + i} style={{ color: equal ? "#12c312" : "#ff4f4f" }}>
                <span>{str_1}</span>
                <span style={styleSearched}>{str_2}</span>
              </span>
            );
          } else if (
            indexStart >= searchIndexStart
            && indexStart < searchIndexEnd
            && indexEnd <= searchIndexEnd
            && indexEnd > searchIndexStart
          ) {
            const str = str1.substring(indexStart, indexEnd);

            return (
              <span key={indexStart + "-" + indexEnd + "-" + i} style={{ 
                color: equal ? "#12c312" : "#ff4f4f" ,
                ...styleSearched
              }}>{str}</span>
            );
          }
          return <p>oops.....</p>
        });
      }
      
    } 
    const str = str1.substring(indexStart, indexEnd);

    return (
      <span key={indexStart + "-" + indexEnd} style={{ color: equal ? "#12c312" : "#ff4f4f" }}>{str}</span>
    );
    

  }

  const __amount = str1.split('').length;

  let index = 0;
  let flag: boolean | undefined = undefined;
  const equlIndexMap = str1.split('').map((char, i, arr) => {
    return char === str2[i];
  }).reduce((acc: number[][] , equal: boolean, i) => {
    if (i === 0) {
      flag = equal;
      
      acc[index] = [i];
    } else {
      if (flag !== equal) {
        acc[index].push(...[flag ? 1 : 0, i]);
        index++;
        acc[index] = [i];
        flag = equal;
      }
    }
    return acc;
  }, []);
  if (equlIndexMap[index]?.length === 1) {
    equlIndexMap[index].push(...[flag ? 1 : 0, __amount ]);
  }

  return equlIndexMap.map( ([ indexStart, equal, indexEnd ]) => {

    return buildStr(!!equal, indexStart, indexEnd)
  });
};

// поптыка покрасить различия в тексте через css  - проблема была в том, что не удавалось указать четкие границы буквы в градиенте
export const buildCompareStyle = (str1: string, str2: string): CSSProperties => {
  const __amount = str1.split('').length;
  const buildBackground = (indexStart: number, equal: boolean, indexEnd: number, amount: number ) => {
    
    const point = (_index: number) => (equal ? "#12c312 " : "#ff4f4f ") + (_index / amount * __amount * 9.8) + "px";
    return (true ? point(indexStart) + ", " : "") + point(indexEnd);
  };
  let index = 0;
  let flag: boolean | undefined = undefined;
  const equalIndexMap = str1.split('').map((char, i, arr) => {
    return char === str2[i];
  }).reduce((acc: number[][] , equal: boolean, i) => {
    if (i === 0) {
      flag = equal;
      
      acc[index] = [i];
    } else {
      if (flag !== equal) {
        acc[index].push(...[flag ? 1 : 0, i - 1]);
        index++;
        acc[index] = [i - 1];
        flag = equal;
      }
    }
    return acc;
  }, []);
  if (equalIndexMap[index]?.length === 1) {
    equalIndexMap[index].push(...[flag ? 1 : 0, __amount - 1]);
  }
  const bgPoints = equalIndexMap.map(([ indexStart, equal, indexEnd ], i, arr) => {
    return buildBackground(
      indexStart, 
      !!equal, 
      indexEnd,
      __amount
    );
  });

  return {
    backgroundImage: `linear-gradient(90deg, ${bgPoints.join(",")})`,
  };
};

export const objConverter = (obj1: IPair<any>, obj2: IPair<any>, searchValue: string, parentKey?: string, subIndex?: number) => {
  const arr1: [string, FieldType][] = buildFieldsArr(obj1).map(item => [ item.key, item ]);
  const arr2: [string, FieldType][] = buildFieldsArr(obj2).map(item => [ item.key, item ]);
  const map1 = new Map(arr1);
  const map2 = new Map(arr2);
  const mainArr: [string, FieldType][] = [...arr1, ...arr2];
  const mainMap = new Map(mainArr);
  const result = Array.from(mainMap.values()).map((initialItem) => getFieldPairProps({
    initialItem,
    map2,
    map1,
    obj2,
    searchValue,
    obj1,
    parentKey,
    subIndex
  }));
  return result;
};

export const getFieldPairProps = (data: {
  initialItem: FieldType,
  map2: Map<string, FieldType>,
  map1: Map<string, FieldType>,
  obj2: IPair<any>,
  obj1: IPair<any>,
  searchValue: string,
  parentKey?: string,
  subIndex?: number
}) => {
  const { 
    initialItem,
    map2,
    map1,
    obj2,
    searchValue,
    obj1,
    parentKey,
    subIndex
  } = data
  const fieldKey = initialItem.key;
  const item1 = map1.get(fieldKey);
  const item2 = map2.get(fieldKey);
    
  const keyExist1 = item1 ? fieldKey in obj2 : false;
  const keyValueEqual1 = item1 ? obj2[fieldKey] === item1.value : false;

  const value1 = item1 && item2 && ["string", "number"].includes(typeof item1.value) ? 
    buildCompareString(String(item1.value), String(item2.value), searchValue) 
    : item1?.value;
  const key1 = item1 && item2 && ["string", "number"].includes(typeof fieldKey) ? 
    buildCompareString(String(fieldKey), String(fieldKey), searchValue) 
  : item1?.key;


  const keyExist2 = item2 ? fieldKey in obj1 : false;
  const keyValueEqual2 = item2 ? obj1[fieldKey] === item2.value : false;

  const value2 = item2 && item1 && ["string", "number"].includes(typeof item2.value) ? 
    buildCompareString(String(item2.value), String(item1.value), searchValue) 
    : item2?.value;
  const key2 = item2 && item1 && ["string", "number"].includes(typeof fieldKey) ? 
    buildCompareString(String(fieldKey), String(fieldKey), searchValue) 
    : item2?.key;

  const pairKey = parentKey ? parentKey + "-" + fieldKey : fieldKey || '';
  const children: any = keyExist1 && keyExist2 && item1 && typeof obj2[fieldKey] === "object" && obj2[fieldKey] !== null && fieldKey
    && typeof obj1[fieldKey] === "object" && obj1[fieldKey] !== null ? objConverter(obj1[fieldKey], obj2[fieldKey], searchValue, pairKey, (subIndex || 0) + 1) : '';
  
  const pair: FieldPairPropsType = { 
    keyExist1,
    keyValueEqual1,
    value1,
    initialKey1: item1?.key || '',
    key1,
    initialValue1: String(item1?.value), 
    keyExist2,
    keyValueEqual2,
    value2,
    initialKey2: item2?.key || '',
    key2,
    hasChildren: !!children,
    pairKey,
    parentKey,
    level: subIndex || 0,
    initialValue2: item2 ? String(item2.value) : ""
  };
  return {
    pair, children
  }
};

export const pairIndexOf = (pair: FieldPairPropsType, str: string): boolean => {
  const { 
    initialKey1,
    initialKey2,
    initialValue1,
    initialValue2
  } = pair;
  return [ initialKey1, initialKey2, initialValue1, initialValue2 ].some(val => val?.indexOf(str) !== -1)
};

export const megaFlatChildren = (arr: {
  pair: FieldPairPropsType;
  children: any;
}[]): FieldPairPropsType[] => {
  return arr.reduce((acc: FieldPairPropsType[], curr) => {
    return [ ...acc , curr.pair , ...(curr.children ? megaFlatChildren(curr.children) : []) ]
  }, []);
};


