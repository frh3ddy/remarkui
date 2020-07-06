import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import samsara from "samsarajs";

const {
  Core: { Transitionable, Transform },
} = samsara;

export const useScale = (vec) => {
  const [x, setScaleX] = useState(vec);
  const transitionable = useMemo(() => {
    return new Transitionable(vec);
  }, []);

  useEffect(() => {
    transitionable.set(x, { curve: "easeOutWall", duration: 250 });
  }, [x]);

  return {
    scaleX: transitionable.map((value) => Transform.scaleX(value)),
    setScaleX,
  };
};
