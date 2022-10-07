import { Col, Input, Row } from "antd";
import React, { FC, useState } from "react";

import { CompareItem } from "@components/CompareItem";
import { SearchBlock } from "@components/SearchBlock";
import { IPair } from "@types";

import { _obj1, _obj2 } from "./constants";
import __obj1 from "./example1.json";
import __obj2 from "./example2.json";
import styles from './CompareForm.module.less';

type PropsType = {
  
};

export const CompareForm: FC<PropsType> = (props) => {
  const [ obj1, setObj1 ] = useState<IPair<any> | null>(__obj1);
  const [ obj2, setObj2 ] = useState<IPair<any> | null>(__obj2);
  const [ updateFlag, setUpdateFlag] = useState<number>(0);

  const [ focusInputRow, setFocusInputRow ] = useState<boolean>(false);
  const [ hoverInputRow, setHoverInputRow ] = useState<boolean>(false);

  const [ searchValue, setSearchValue ] = useState<string>();
  
  const handleChangeObj = (e: React.ChangeEvent<HTMLInputElement>, type: "1" | "2") => {
    const setVal = (val: any) => {
      type === "1" ? setObj1(val) : setObj2(val)
    };
    try {
      if (e.target.value === "") {
        setVal(null);
      } else {
        const obj = JSON.parse(e.target.value);
        setVal(obj);
      }
      setUpdateFlag(updateFlag + 1);
    } catch (error) {
      console.debug(error);
    }
  };
  
  const inputProps = (type: "1" | "2") => ({
    onFocus: () => setFocusInputRow(true),
    onBlur: () => setFocusInputRow(false),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChangeObj(e, type),
    placeholder: "Input json object please",
    allowClear: true
  });

  return (
    <div className={styles.compareForm}>
      <Row gutter={16} justify="space-between" className={styles.inputRow + " " + (focusInputRow || hoverInputRow ? styles.focus : "")} 
        onMouseEnter={() => setHoverInputRow(true)} 
        onMouseLeave={() => setHoverInputRow(false)}
      >
        <Input {...inputProps("1")} />
        <div className={styles.logo}>
          <span>JSON</span>
          <span>Compare</span>
        </div>
        <Input {...inputProps("2")} />
      </Row>
      <Row gutter={16} className={styles.compareRow + " customScroll"}>
        <Col span={24}>
          <CompareItem
            obj1={obj1}
            obj2={obj2}
            updateFlag={updateFlag}
            searchValue={searchValue}
          />
        </Col>
      </Row>
      <div className={styles.functionalBlock}>
        <SearchBlock 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
    </div>
  );
};