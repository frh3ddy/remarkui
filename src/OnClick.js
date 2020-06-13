import { useLayoutEffect, useContext } from "react";
import SamsaraContext from "./samsaraContext";

const OnClick = ({ event, signal }) => {
  const { view } = useContext(SamsaraContext);
  if (!view) {
    throw new Error("OnClick must be inside a Panel");
  }

  useLayoutEffect(() => {
    view.setEventHandler(event, signal);
    return () => view.removeEventHandler(event, signal);
  });

  return null;
};

export default OnClick;
