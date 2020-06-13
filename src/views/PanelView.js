const { View } = require("samsarajs").Core;
const { Transform } = require("samsarajs").Core;
const { Surface } = require("samsarajs").DOM;
const { Transitionable } = require("samsarajs").Core;
const { Stream } = require("samsarajs").Streams;
const { GenericInput } = require("samsarajs").Inputs;

export default View.extend({
  defaults: {
    color: undefined,
    margin: undefined,
    minHeight: undefined,
    alignment: "default",
    translation: [undefined, undefined, undefined],
    needsOutput: false,
    nodesss: [],
  },
  initialize(options) {
    const {
      _opacity,
      color,
      width,
      height,
      alignment,
      translation,
      minHeight,
      margin,
      cornerRadius,
      zIndex,
      border,
      subs,
      _proportions,
      needsOutput,
      nodesss,
      layout,
    } = options;
    this.cachedNodeSize = [0, 0];
    this.cacheTransform = undefined;
    this.cachedTranslation = translation;
    this.cachedOpacity = _opacity;

    this.scaleOrigin = [0, 0];
    this.nodesss = nodesss;

    let ancestor;

    const [x = 0, y = 0, z = 0] = translation;

    this.scale = new Transitionable([1, 1, 1]);
    this.translation = new Transitionable([x, y, z]);
    this.rotation = new Transitionable([0, 0, 0]);

    const mergedStream = Stream.merge({
      translate: this.translation,
      scale: this.scale,
      rotate: this.rotation,
    });

    const mapMergedStream = mergedStream.map((stream) => {
      let scaleOriginX = 0;
      let scaleOriginY = 0;
      if (this.scaleOrigin[0] !== 0) {
        scaleOriginX = this.scaleOrigin[0] * this.cachedNodeSize[0];
      }

      if (this.scaleOrigin[1] !== 0) {
        scaleOriginY = this.scaleOrigin[1] * this.cachedNodeSize[1];
      }

      const rotate = Transform.composeMany(
        Transform.rotateX(stream.rotate[0]),
        Transform.rotateY(stream.rotate[1]),
        Transform.rotateZ(stream.rotate[2])
      );

      const scale = Transform.scale(stream.scale);

      const scatrans = Transform.thenMove(
        Transform.aboutOrigin([scaleOriginX, scaleOriginY], scale),
        stream.translate
      );

      return Transform.compose(scatrans, rotate);
    });

    const { origin, align } = getAlignment(alignment);
    this.origin = new Transitionable(origin);
    this.align = new Transitionable(align);
    this.zise = new Transitionable([width, height]);
    this.opacity = new Transitionable(_opacity);

    let transProps;

    if (_proportions) {
      this.proportions = new Transitionable(_proportions);
      transProps = {
        transform: mapMergedStream,
        align: this.align,
        origin: this.origin,
        proportions: this.proportions,
      };
    } else {
      transProps = {
        transform: mapMergedStream,
        align: this.align,
        origin: this.origin,
        size: this.zise,
      };
    }

    const trans = this.add(transProps);

    const reset = trans.add({
      origin: [0, 0],
      align: [0, 0],
    });

    ancestor = reset.add({
      opacity: this.opacity,
    });

    this.ancestor = ancestor;

    const marginsNode = createMarginNode(margin, ancestor);

    this.subscribedNode = undefined;
    if (layout) {
      this.size.on("end", () => {
        if (this.subscribedNode) return;
        nodesss.forEach((node) => {
          if (node.name === layout) {
            this.subscribedNode = node.view;
          }
        });
      });
    }

    if (subs) {
      subs.size.on("update", (size) => {
        if (!size) return;

        this.zise.set([size[1] - 50, size[1] - 50]);
      });

      // const ff = new Transitionable()

      // ff.subscribe(subs)
      // ff.on('update', g => {
      //   // console.log(g)
      //   this.rotation.set(
      //   [g.cumulate[0] * (Math.PI / 180),  g.cumulate[1]* (Math.PI / 180), 0 * (Math.PI / 180)])
      // })
    }

    if (color || border) {
      this.background = new Surface({
        size: [undefined, undefined],
        properties: {
          "z-index": zIndex,
          background: color,
          "border-radius": cornerRadius,
          border,
        },
      });
      marginsNode.add(this.background);

      if (needsOutput) {
        const gestureInput = new GenericInput(["mouse", "touch"]);
        gestureInput.subscribe(this.background);
        this.output.subscribe(gestureInput);
      }
    }

    // Total Size of the node including margins
    this.node = marginsNode;

    this.node.layout.on(
      "end",
      ({ transform }) => (this.cacheTransform = transform)
    );

    // Size of the node without the margings
    this.size = getNodeSize(ancestor, options);

    this.size.on("end", (size) => {
      if (!size) return;
      this.cachedNodeSize[0] = size[0];
      this.cachedNodeSize[1] = size[1];
    });
  },
  updateTranslation(vector, transition, callback) {
    const [x = 0, y = 0, z = 0] = parseVector(vector).map((point) => {
      if (!Array.isArray(point) && typeof point === "object") {
        if (this.nodesss.length > 0) {
          let value;
          this.nodesss.forEach((node) => {
            if (node.name === point.node) {
              if (point.prop === "x") {
                if (node.view.cacheTransform && this.cacheTransform) {
                  value =
                    node.view.cacheTransform[12] - this.cacheTransform[12] + 1;
                } else {
                  value = 0;
                }
              }

              if (point.prop === "y") {
                if (node.view.cacheTransform && this.cacheTransform) {
                  value =
                    node.view.cacheTransform[13] - this.cacheTransform[13] + 3;
                } else {
                  value = 0;
                }
              }

              if (point.prop === "z") {
                value = node.view.cacheTransform[14];
              }
            }
          });

          return value;
        }
      }

      return point;
    });

    this.translation.set([x, y, z], transition, callback);
  },
  updateOpacity(opacity, transition, callback) {
    if (!transition) {
      transition = { duration: 0 };
    }
    this.opacity.set(opacity, transition, callback);
  },
  updateScale(vector, transition, callback) {
    const vectorArr = vector.map((point) => {
      if (typeof point === "string") {
        let nodeName;
        let nodeProp;

        const name = point.match("{(.*?)}")[1];

        if (name) {
          const splitString = name.split(".");
          if (splitString.length > 1) {
            nodeName = splitString[0];
            nodeProp = splitString[1];
          }
        }

        const operator = point.split("");
        const divOp = operator.filter((char) => char === "/");
        const number = point.split("/");

        const getn = number
          .map((i) => parseFloat(i))
          .filter((h) => !isNaN(h) && typeof h === "number");

        if (nodeName && nodeProp && divOp.length > 0 && getn.length > 0) {
          let value;
          if (this.nodesss.length > 0) {
            this.nodesss.forEach((node) => {
              if (node.name === nodeName) {
                if (nodeProp === "w") {
                  value = node.view.cachedNodeSize[0];
                }

                if (nodeProp === "h") {
                  value = node.view.cachedNodeSize[1];
                }
              }
            });
          } else {
            return 1;
          }

          if (divOp[0] === "/") {
            return value / getn[0];
          }
        }
      }

      return point;
    });

    this.scaleOrigin[0] = vectorArr[3];
    this.scaleOrigin[1] = vectorArr[4];

    const [x = 1, y = 1, z = 1] = vectorArr;
    this.scale.set([x, y, z], transition);
  },
  setEventHandler(event, handler) {
    // save the handler function to remove the listener
    this.handler = handler;

    if (this.background) {
      this.background.on(event, handler);
      this.background.setProperties({ cursor: "pointer" });
    } else {
      this.bounds = new Surface({ properties: { cursor: "pointer" } });
      // TODO: decide if hitTest includes margin, if not then add to margin node
      setTimeout(() => this.ancestor.add(this.bounds), 0);
      this.bounds.on(event, handler);
    }
  },

  removeEventHandler(event, handler) {
    if (this.background) {
      this.background.off(event, this.handler);
      this.background.setProperties({ cursor: "initial" });
    } else if (this.bounds) {
      this.bounds.off(event, this.handler);
      this.bounds.remove();
    }
  },
  updateRotation(rotation, transition, cb) {
    let callback = cb;
    let [degrees, x = 0, y = 0, z = 0] = rotation;

    if (degrees) {
      z = degrees;
    }

    if (cb === true) {
      callback = undefined;
    }

    this.rotation.set(
      [x * (Math.PI / 180), y * (Math.PI / 180), z * (Math.PI / 180)],
      transition,
      callback
    );
  },
  updateSize(size) {
    this.zise.set(size);
  },
  updateColor(color) {
    if (this.background) {
      this.background.setProperties({ background: color });
    }
  },
});

function parseVector(vector) {
  return vector.map((point) => {
    if (typeof point === "string") {
      const spl = point.split(".");
      if (spl.length > 1) {
        return { node: spl[0], prop: spl[1] };
      }
    }

    return point;
  });
}

function getAlignment(align) {
  if (align === undefined) return {};

  switch (align) {
    case "center":
      return { align: [0.5, 0.5], origin: [0.5, 0.5] };
    case "centerLeft":
      return { align: [0, 0.5], origin: [0, 0.5] };
    case "centerRight":
      return { align: [1, 0.5], origin: [1, 0.5] };
    case "horizontalCenter":
      return { align: [0.5, 0], origin: [0.5, 0] };
    case "right":
      return { align: [1, 0], origin: [1, 0] };
    case "bottom":
      return { align: [0, 1], origin: [0, 1] };
    case "bottomRight":
      return { align: [1, 1], origin: [1, 1] };
    case "bottomCenter":
      return { align: [0.5, 1], origin: [0.5, 1] };
    default:
      return { align: [0, 0], origin: [0, 0] };
  }
}

function getNodeSize(node, options) {
  const { width, height, minHeight, margin } = options;

  return node.size.map((size) => {
    if (!size) return false;

    let marginsArray = [];
    let topAndBottomMargin = 0;
    let leftAndRightMargin = 0;

    if (margin) {
      marginsArray = parseStringMargin(margin);

      if (marginsArray.length === 1) {
        topAndBottomMargin = marginsArray[0] * 2;
        leftAndRightMargin = marginsArray[0] * 2;
      }

      if (marginsArray.length === 2) {
        topAndBottomMargin = marginsArray[1] * 2;
        leftAndRightMargin = marginsArray[0] * 2;
      }

      if (marginsArray.length === 3) {
        topAndBottomMargin = marginsArray[1] * 2;
        leftAndRightMargin = marginsArray[0] + marginsArray[2];
        // console.log(marginsArray, leftAndRightMargin)
      }

      if (marginsArray.length === 4) {
        topAndBottomMargin = marginsArray[1] + marginsArray[3];
        leftAndRightMargin = marginsArray[0] + marginsArray[2];
      }
    }

    if (minHeight && size[1] < minHeight) {
      size[1] = minHeight;
    }

    if (width) {
      size[0] += leftAndRightMargin;
    }
    if (height) {
      size[1] += topAndBottomMargin;
    }

    return size;
  });
}

function parseStringMargin(string) {
  return string
    .split(" ")
    .filter((substr) => substr.length > 0)
    .map((str) => parseFloat(str))
    .filter((number) => !isNaN(number));
}

function createMarginNode(margins, node) {
  if (!margins) return node;
  const marginsArray = parseStringMargin(margins);

  const { length } = marginsArray;
  let leftTop;
  switch (length) {
    case 4:
      leftTop = node.add({
        margins: [marginsArray[0] / 2, marginsArray[1] / 2],
        origin: [1, 1],
        align: [1, 1],
      });
      return leftTop.add({
        size: [undefined, undefined],
        margins: [marginsArray[2] / 2, marginsArray[3] / 2],
      });
    case 3:
      leftTop = node.add({
        margins: [marginsArray[0] / 2, marginsArray[1]],
        origin: [1, 0.5],
        align: [1, 0.5],
      });

      return leftTop.add({
        margins: [marginsArray[2] / 2, 0],
      });
    case 2:
      return node.add({
        margins: [marginsArray[0], marginsArray[1]],
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
      });
    case 1:
      return node.add({
        margins: [marginsArray[0], marginsArray[0]],
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
      });
    default:
      return node;
  }
}
