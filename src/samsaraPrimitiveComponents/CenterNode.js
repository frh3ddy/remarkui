import React, { useLayoutEffect, useContext } from "react";
// import SamsaraContext from "../samsaraContext";
import { Node } from "./Node";

export const CenterNode = React.memo(({ children }) => {
  return (
    <Node size={[200, 200]} align={[0.5, 0.5]} origin={[0.5, 0.5]}>
      {children}
    </Node>
  );
});
