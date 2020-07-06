import React from "react";
import { Node } from "../../samsaraPrimitiveComponents/Node";

export const Margin = React.memo(({ children, margin }) => {
  if (margin) {
    return (
      <Node align={[0.5, 0.5]} origin={[0.5, 0.5]} margins={[margin, margin]}>
        {children}
      </Node>
    );
  }

  return children;
});
