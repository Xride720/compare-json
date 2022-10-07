import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "antd";

import { ScrollController } from "@components/ScrollController";
import { FieldPair } from "@components/FieldPair";
import { SettingsScrollType } from "@components/ScrollController/models";

import { megaFlatChildren, objConverter, pairIndexOf } from "./helpers";
import { PropsType } from "./models";

export const CompareItem: FC<PropsType> = (props) => {
  const { obj1, obj2, updateFlag, searchValue } = props;

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const updateRef = useRef<() => void>();

  const compare = useMemo(() => {
    const res = obj1 && obj2 ? objConverter(
      obj1, obj2, searchValue || '' 
    ) : [];
    const arr = megaFlatChildren(res);
    return arr;
  }, [obj1, obj2, searchValue]);

  const filteredCompare = useMemo(() => {
    const filteredBySearch = compare.filter(pair => pairIndexOf(pair, searchValue || ''));
    const filteredByExpand = filteredBySearch.filter(pair => !(pair.parentKey && !expandedKeys.includes(pair.parentKey)));
    return filteredByExpand;
  }, [expandedKeys, compare, searchValue]);

  const SETTINGS_SCROLL: SettingsScrollType = {
    itemHeight: 81,
    tolerance: 5,
    minIndex: 0,
    maxIndex: filteredCompare.length,
    startIndex: 0
  };

  const getData = (offset: number, limit: number) => {
    const data = [];
    const start = Math.max(SETTINGS_SCROLL.minIndex, offset);
    const end = Math.min(offset + limit - 1, SETTINGS_SCROLL.maxIndex);
    
    if (start <= end) {
      data.push(...filteredCompare.slice(start, end))
    }
    return data;
  };

  const handleExpand = (key: string) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter(_key => _key !== key && !_key.startsWith(key + "-")));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }
  };

  useEffect(() => {
    updateRef.current && updateRef.current();
  }, [expandedKeys, updateFlag, filteredCompare]);

  return (
    <div className="compareItem">
      <Row style={{ display: "flex", alignItems: "start", justifyContent: "center" }}>
        <Col span={24}>
            <ScrollController 
              updateRef={updateRef}
              listItemsCount={filteredCompare.length}
              settings={SETTINGS_SCROLL}
              getItems={getData}
              viewportHeight={window.innerHeight}
              renderItems={(pair) => (
                <FieldPair 
                  {...pair}
                  key={pair.pairKey}
                  handleExpand={handleExpand}
                  expanded={expandedKeys.includes(pair.pairKey)}
                />
              )}
              defaultPaddingTop={window.innerWidth > 800 ? 96 : 113}
            />
        </Col>
      </Row>
    </div>
  );
};