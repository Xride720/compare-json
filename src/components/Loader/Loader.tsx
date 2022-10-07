import React, { FC } from "react";
import { Spin } from "antd";
import styles from "./Loader.module.less";

type PropsType = {
  placement: "top" | "bottom"
}

export const Loader: FC<PropsType> = (props) => {
  const {
    placement
  } = props;
  return (
    <div className={styles.loader}
      style={{
        top: placement === "top" ? 20 : undefined,
        bottom: placement === "bottom" ? 20 : undefined
      }}
    >
      <Spin />
    </div>
  )
};