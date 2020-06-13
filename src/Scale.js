import { useEffect, useContext } from "react";
import SamsaraContext from "./samsaraContext";
import { getTransition } from "./utils";

export const Scale = (props) => {
  const {
    delay = 0,
    duration,
    easing,
    factor,
    x,
    y,
    z,
    callback,
    aboutOrigin = [0, 0],
  } = props;

  const { view } = useContext(SamsaraContext);
  if (!view) {
    throw new Error("OnClick must be inside a Panel");
  }

  let transition = !!easing ? getTransition(props) : { duration };

  useEffect(() => {
    let canceled = false;
    let vector = !!factor
      ? [factor, factor, factor, ...aboutOrigin]
      : [x, y, z, ...aboutOrigin];

    setTimeout(() => {
      if (!canceled) {
        view.updateScale(vector, transition, callback);
      }
    }, delay);

    return () => {
      canceled = true;
      transition = getTransition(props, true);
      //TODO: It may need to reset the scaleOrigin in the view
      view.updateScale([1, 1, 1, ...view.scaleOrigin], transition);
    };
  }, [x, y, z, factor, aboutOrigin]);

  return null;
};
