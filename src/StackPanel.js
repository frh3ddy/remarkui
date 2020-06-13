import React, { useEffect, useContext, useRef } from "react";
import SamsaraContext from "./samsaraContext";
import samsara from "samsarajs";

const {
  Layouts: { SequentialLayout, FlexibleLayout },
} = samsara;

const DIRECTION = {
  horizontal: 0,
  vertical: 1,
};

const StackPanel = (props) => {
  const { node, context } = useContext(SamsaraContext);
  let parentNode = context || node;

  const flex = getFlex(props);

  const method = getMethod(parentNode);
  const orientation = props.orientation || "horizontal";
  const spacing = props.itemSpacing || 0;

  let { current: stackPanelNode } = useRef(
    new FlexibleLayout({
      size: [props.width, props.height],
      direction: DIRECTION[orientation],
      spacing,
    })
  );

  useEffect(() => {
    parentNode[method](stackPanelNode, flex);
  }, [stackPanelNode]);

  return (
    <SamsaraContext.Provider value={{ node: stackPanelNode }}>
      {props.children}
    </SamsaraContext.Provider>
  );
};

function getFlex({ height, width, minHeight, minWidth }) {
  return isNaN(width || minHeight || minWidth || height) ? 1 : undefined;
}

function getMethod(parent) {
  switch (true) {
    case parent instanceof SequentialLayout:
      return "push";
    case parent instanceof FlexibleLayout:
      return "push";
    default:
      return "add";
  }
}

export default StackPanel;
