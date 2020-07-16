const View = require("samsarajs").Core.View;
const Transform = require("samsarajs").Core.Transform;
const Transitionable = require("samsarajs").Core.Transitionable;
const Surface = require("samsarajs").DOM.Surface;

export default View.extend({
  defaults: {
    textColor: "initial",
    color: undefined,
    height: undefined,
    width: undefined,
    target: undefined,
  },
  initialize({ color, textColor, width, height, target, containerRef, setHh }) {
    let size = [true, true];
    this.origin = new Transitionable([0, 0]);
    this.align = new Transitionable([0, 0]);
    const surfaceOrigin = this.origin.map((value) => value);
    const nodeAlign = this.align.map((value) => value);

    if (width || height) {
      size = [width, height];
    }

    this.surface = new Surface({
      properties: { color: textColor, background: color || "" },
      size: size,
      origin: surfaceOrigin,
      target,
    });

    this.surface.on("deploy", (target) => {
      if (containerRef) {
        containerRef.current = target;
        setHh(true);
      }
    });
    this.add({ align: nodeAlign }).add(this.surface);
    // this.size = this.surface.size.map(value => {
    //   console.log('jjjjj')
    //   if (!value) return
    //   return value
    // })
  },
  setContent(content) {
    this.surface.setContent(content);
  },
  setTranslation(vector) {
    const [x = 0, y = 0, z = 0] = vector;
    this._layoutNode.set({ transform: Transform.translate([x, y, z]) });
  },
  resize(size) {
    this.setSize(size);
    this.surface.setSize([undefined, undefined]);
  },
  setColor(color) {
    this.surface.setProperties({ background: color });
  },
  getTarget() {
    return this.surface._currentTarget;
  },
  setAlignment(alignment) {
    if (!alignment) return;
    this.surface.setSize([true, true]);
    const { align, origin } = getAlignment(alignment);
    this.origin.set(origin);
    this.align.set(align);
  },
});

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
    case "verticalCenter":
      return { align: [0, 0.5], origin: [0, 0.5] };
    case "right":
      return { align: [1, 0], origin: [1, 0] };
    case "bottom":
      return { align: [0, 1], origin: [0, 1] };
    default:
      return {};
  }
}
