import React, { useEffect, useLayoutEffect, useContext, useRef } from "react";
import SamsaraContext from "./samsaraContext";
import samsara from "samsarajs";
import PanelView from "./views/PanelView";

const {
  Layouts: { SequentialLayout, FlexibleLayout },
} = samsara;

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

function getFlex({ height, width, minHeight, minWidth }) {
  return isNaN(width || minHeight || minWidth || height) ? 1 : undefined;
}

const Panel = ({
  children,
  height,
  width,
  minHeight,
  minWidth,
  opacity,
  margin,
  color,
  zIndex,
  border,
  cornerRadius,
  alignment,
  x,
  y,
  z,
  layout,
}) => {
  const { node, context } = useContext(SamsaraContext);
  let parentNode = context || node;

  if (!parentNode) {
    throw new Error("Panel should be a child of Context");
  }

  const flex = getFlex({ height, width, minHeight, minWidth });
  const method = getMethod(parentNode);

  let _proportions = [1, 1];
  if (typeof width === "string" || typeof height === "string") {
    if (width) {
      _proportions[0] = parseInt(width, 10) / 100;
    }

    if (height) {
      _proportions[1] = parseInt(height, 10) / 100;
    }
  } else {
    _proportions = undefined;
  }

  const viewOptions = {
    _opacity: opacity === undefined ? 1 : opacity,
    minHeight,
    _proportions,
    margin,
    color,
    width,
    zIndex: zIndex ? zIndex() : undefined,
    height,
    border,
    cornerRadius,
    alignment,
    translation: [x, y, z],
    layout,
  };

  const { current: panelView } = useRef(new PanelView(viewOptions));
  useLayoutEffect(() => {
    parentNode[method](panelView, flex);
  }, [panelView]);

  useEffect(() => {
    if (panelView.background) {
      panelView.background.setProperties({
        "z-index": zIndex() ? 1 : 0,
      });
    }
  }, [panelView, zIndex]);

  useEffect(() => {
    panelView.updateTranslation([x, y, z]);
  }, [panelView, x, y, z]);

  useEffect(() => {
    panelView.updateSize([width, height]);
  }, [width, height, panelView]);

  useEffect(() => {
    panelView.updateColor(color);
  }, [color, panelView]);

  useEffect(() => {
    panelView.updateOpacity(opacity);
    return () => {
      if (getMethod(parentNode) === "push") {
        parentNode.unlink(panelView);
      }
      setTimeout(() => panelView.remove(), 66);
    };
  }, [opacity, panelView, parentNode]);

  return (
    <SamsaraContext.Provider value={{ node: panelView.node, view: panelView }}>
      {children}
    </SamsaraContext.Provider>
  );
};

Panel.defaultProps = {
  zIndex: () => {},
};

export default Panel;
