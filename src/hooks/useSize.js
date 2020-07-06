import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import samsara from "samsarajs";

const {
  Core: { Transitionable, Transform },
} = samsara;

export const useSize = (initialSize) => {
  const [size, setSize] = useState(initialSize);
  const transitionable = useMemo(() => {
    return new Transitionable(initialSize);
  }, []);

  useEffect(() => {
    transitionable.set(size, { curve: "easeOutWall", duration: 250 });
  }, [size]);

  return {
    size: transitionable,
    setSize,
  };
};
