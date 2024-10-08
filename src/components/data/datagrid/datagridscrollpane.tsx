import clsx from "clsx";
import React, { useContext, useEffect } from "react";

import { DataGridContext } from "./datagrid";

/**
 * DataGrid scroll pane, contains the scrollable content.
 * @param children
 * @constructor
 */
export const DataGridScrollPane: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { allowOverflowX, scrollPaneRef } = useContext(DataGridContext);

  // Overflow detection
  useEffect(() => {
    detectOverflowX();
    window.addEventListener("resize", detectOverflowX);
    window.addEventListener("scroll", detectOverflowX);
    () => window.removeEventListener("resize", detectOverflowX);
  });

  /**
   * Toggles "mykn-datagrid__scrollpane--overflow-x" to class list based on
   * whether `allowOverflowX=true` and the contents are overflowing.
   */
  const detectOverflowX = () => {
    if (!scrollPaneRef?.current) {
      return;
    }
    const node = scrollPaneRef.current;

    const hasOverflowX = node.scrollWidth > node.clientWidth;
    const expX = allowOverflowX && hasOverflowX;
    node.classList.toggle("mykn-datagrid__scrollpane--overflow-x", expX);

    const hasOverflowY = node.scrollHeight > node.clientHeight;
    const expY = hasOverflowY;
    node.classList.toggle("mykn-datagrid__scrollpane--overflow-y", expY);
  };

  return (
    <div ref={scrollPaneRef} className={clsx("mykn-datagrid__scrollpane")}>
      {children}
    </div>
  );
};
