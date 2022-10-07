import { Col, Row } from "antd";
import React, { FC } from "react";
import { FieldPairPropsType } from "./models";
import styles from "./FieldPair.module.less";

export const FieldPair : FC<FieldPairPropsType> = (props) => {
  const { 
    keyExist1,
    keyValueEqual1,
    keyExist2,
    keyValueEqual2,
    value1,
    value2,
    key1,
    key2,
    hasChildren,
    pairKey,
    level,
    handleExpand,
    expanded
  } = props;
  return (
    <Row style={{ display: "flex", alignItems: "start", justifyContent: "center" }}>
      <Col span={24 - (level || 0) * 2}>
        <div    
          className={styles.pair} 
          style={{
            border: "1px solid " + (hasChildren ? "#9fff9ea6" : "transparent"),
            cursor: hasChildren ? "pointer" : "default",
            boxShadow: expanded ? "rgb(39 255 0 / 43%) 0px 0px 5px 1px" : undefined
          }}
          onClick={() => handleExpand && hasChildren && handleExpand(pairKey)}
        >
          <p className={styles.pair__row}>
            <span className={styles.pair__row_key} style={{ color: keyExist1 ? "#12c312" : "#ff4f4f" }}>{key1}</span>
            <span className={styles.pair__row_value}  style={{ color: keyValueEqual1 ? "#12c312" : "#ff4f4f" }}>{value1}</span>
          </p>
          <p className={styles.pair__row}>
            <span className={styles.pair__row_key} style={{ color: keyExist2 ? "#12c312" : "#ff4f4f" }}>{key2}</span>
            <span className={styles.pair__row_value} style={{ color: keyValueEqual2 ? "#12c312" : "#ff4f4f" }}>{value2}</span>
          </p>
        </div>
      </Col>
    </Row>
  );
};