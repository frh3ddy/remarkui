import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import samsara from "samsarajs";

const {
  Core: { Transitionable, Transform },
} = samsara;

export const useTranslate = (vec) => {
  const [x, setX] = useState(vec);
  const transitionable = useMemo(() => {
    return new Transitionable(vec);
  }, []);

  useEffect(() => {
    transitionable.set(x, { curve: "easeInOut", duration: 250 });
  }, [x]);

  return {
    transform: transitionable.map((value) => Transform.translateX(value)),
    setX,
  };
};
