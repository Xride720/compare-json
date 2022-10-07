import { SearchOutlined } from "@ant-design/icons";
import { Input, InputRef } from "antd";
import React, { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { SearchBlockPropsType } from "./models";
import styles from "./SearchBlock.module.less";

const SearchBlockComponent : FC<SearchBlockPropsType> = (props) => {
  const { 
    searchValue,
    setSearchValue
  } = props;

  const inputRef = useRef<InputRef | null>( null );

  const [ collapsed, setCollapsed ] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
  };

  const toggleCollapsed = useCallback(() => {
    if (!collapsed) {
      setSearchValue(undefined);
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed, setSearchValue]);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      toggleCollapsed();
    }
  }, [toggleCollapsed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div className={styles.SearchBlock + " " + (collapsed ? styles.collapsed : "")}>
      <Input 
        value={searchValue} 
        onChange={handleChange}
        className={styles.searchInput}
        allowClear
        ref={inputRef}
      />
      <div className={styles.triggerBtn} onClick={toggleCollapsed}>
        <SearchOutlined />
      </div>
    </div>
  );
};

export const SearchBlock = memo(SearchBlockComponent);