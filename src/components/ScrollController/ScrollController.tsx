import React, { FC, useEffect, useRef, useState } from "react";

import { Loader } from "@components/Loader";

import { PropsType } from "./models";
import styles from "./ScrollController.module.less";

export const ScrollController: FC<PropsType> = (props) => {
  const {  
    updateRef,
    listItemsCount,
    getItems,
    renderItems,
    settings: {
      itemHeight,
      tolerance,
      minIndex,
    },
    viewportHeight,
    defaultPaddingTop,
    defaultPaddingBottom
  } = props;

  const [ topPaddingHeight, setTopPaddingHeight ] = useState<number>();
  const [ bottomPaddingHeight, setBottomPaddingHeight ] = useState<number>();
  const [ listItems, setListItems ] = useState<any[]>();

  const amount = Math.floor(viewportHeight / itemHeight);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastIndexRef = useRef<number>(0);
  
  const handleScroll = (e?: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!wrapRef.current) return;
    const totalHeight = listItemsCount * itemHeight;
    const toleranceHeight = tolerance * itemHeight;
    const bufferedItems = amount + 2 * tolerance;

    const scrollTop = e ? (e.target as any).scrollTop : wrapRef.current.scrollTop;
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    if (index === lastIndexRef.current && e) return;
    const data = getItems(index, bufferedItems);
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    setTopPaddingHeight(topPaddingHeight);
    setBottomPaddingHeight(bottomPaddingHeight);
    setListItems(data);
    lastIndexRef.current = index;
  };

  updateRef.current = handleScroll;

  useEffect(() => {
    const data = getItems(0, amount + tolerance)
    setListItems(data);
    setTopPaddingHeight(0);
    setBottomPaddingHeight((listItemsCount - data.length) * itemHeight);
  }, []);


  return (
    <div className={styles.ScrollControllerWrap + " customScroll"}
      ref={wrapRef} 
      style={{ minHeight: viewportHeight, maxHeight: viewportHeight }}
      onScroll={handleScroll}
    >
        {defaultPaddingTop ? <div style={{ height: defaultPaddingTop, position: "relative" }}></div> : ""}
        <div style={{ height: topPaddingHeight, position: "relative" }}>{topPaddingHeight ? <Loader placement="bottom"/> : ""}</div>
          {listItems && listItems.map(renderItems)}
        <div style={{ height: bottomPaddingHeight, position: "relative" }}>{bottomPaddingHeight ? <Loader placement="top"/> : ""}</div>
        {defaultPaddingBottom ? <div style={{ height: defaultPaddingTop, position: "relative" }}></div> : ""}
    </div>
  );
};

