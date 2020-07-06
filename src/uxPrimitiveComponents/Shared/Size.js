import React from "react";
import { Node } from "../../samsaraPrimitiveComponents/Node";

export const Size = React.memo(({ children, width, height, alignment }) => {
  if (width || height) {
    return (
      <Node size={[width, height]} origin={[0.5, 0.5]} align={[0.5, 0.5]}>
        {children}
      </Node>
    );
  }

  return children;
});
