import { useEffect, useContext } from "react";
import SamsaraContext from "./samsaraContext";
import { getTransition } from "./utils";

export const Move = (props) => {
  const { delay = 0, duration, easing, x, y, z, callback } = props;

  const { view } = useContext(SamsaraContext);
  if (!view) {
    throw new Error("OnClick must be inside a Panel");
  }

  let transition = !!easing ? getTransition(props) : { duration };

  useEffect(() => {
    let canceled = false;
    setTimeout(() => {
      if (!canceled) {
        view.updateTranslation([x, y, z], transition, callback);
      }
    }, delay);

    return () => {
      canceled = true;
      transition = getTransition(props, true);
      view.updateTranslation(view.cachedTranslation || [0, 0, 0], transition);
    };
  }, [x, y, z]);

  return null;
};
