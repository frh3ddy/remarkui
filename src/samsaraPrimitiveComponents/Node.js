import {
  useLayoutEffect,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import ReactDOM from "react-dom";

import samsara from "samsarajs";

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

const Node = (props) => {
  const { node, context } = useContext(SamsaraContext);
  let parentNode = context || node;
  const method = getMethod(parentNode);
  const [, setHh] = useState(false);

  const containerRef = useRef(null);

  const { current: surface } = useRef(
    new SurfaceView({
      textColor: props.textColor,
      color: props.color,
      containerRef,
      height: props.height,
      width: props.width,
      setHh,
    })
  );

  useLayoutEffect(() => {
    parentNode[method](surface);
  }, [surface]);

  useEffect(() => {
    setTimeout(() => {
      surface.setAlignment(props.alignment);
    }, 0);
  }, [props.alignment]);

  if (containerRef.current) {
    return ReactDOM.createPortal(props.children, containerRef.current);
  } else {
    return null;
  }
};

export default Node;
