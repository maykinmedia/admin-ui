import React from "react";

import "./stackctx.scss";

export type StackCtxProps = React.ComponentProps<"div">;

/**
 * StackCtx (stacking context) utility component
 */
export const StackCtx: React.FC<StackCtxProps> = ({ children, ...props }) => (
  <div className="mykn-stackctx" {...props}>
    {children}
  </div>
);
