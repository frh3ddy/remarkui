import React, {
  useLayoutEffect,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import SurfaceView from "./views/SurfaceView";
import SamsaraContext from "./samsaraContext";
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

const ReactSurface = (props) => {
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

export default ReactSurface;

// export default class SSurface extends React.Component {
//   constructor(props, context) {
//     super(props);
//     this.state = { deploy: false, hasError: false };

//     this.fragment = document.createElement("div");
//     this.fragment.setAttribute("style", "width:100%; height: 100%; opacity: 0");

//     context.parent[method](this.surface);
//   }

//   componentDidUpdate(prevProps) {
//     this.surface.setContent(this.fragment);
//     if (this.props.alignment) {
//       this.surface.setAlignment(this.props.alignment);
//     } else {
//       this.surface.resize([this.props.width, this.props.height]);
//     }
//     if (this.props.color) this.surface.setColor(this.props.color);
//     // this.surface.setContent(this.fragment)
//     setTimeout(
//       () =>
//         this.fragment.setAttribute(
//           "style",
//           "width:100%; height: 100%; opacity: 1"
//         ),
//       0
//     );
//   }

//   componentWillUnmount() {
//     if (getMethod(this.context.parent) === "push") {
//       this.context.parent.unlink(this.surface);
//     }
//     setTimeout(() => this.surface.remove(), 0);
//   }

//   render() {
//     return ReactDOM.createPortal(this.props.children, this.fragment);
//   }
// }
