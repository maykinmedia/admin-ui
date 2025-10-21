import clsx from "clsx";
import React from "react";

import "./stackctx.scss";

export type StackCtxProps = React.ComponentProps<"div">;

/**
 * StackCtx (stacking context) utility component
 */
export const StackCtx: React.FC<StackCtxProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx("mykn-stackctx", className)} {...props}>
    {children}
  </div>
);
