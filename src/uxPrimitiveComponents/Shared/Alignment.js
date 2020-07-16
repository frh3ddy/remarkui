import React from 'react';
import { Node } from '../../samsaraPrimitiveComponents/Node';

export const Alignment = React.memo(
  ({ children, alignment, render, width, height, margin }) => {
    let childrenHeight;
    let childrenWidth;
    const { origin, align } = getAlignment(alignment);

    let mSizeV = 0;
    let mSizeH = 0;

    if (margin) {
      const mm = parseStringMargin(margin.toString());
      switch (mm.length) {
        case 4:
          mSizeV = mm[1] + mm[3];
          mSizeH = mm[0] + mm[2];
          break;
        case 3:
          mSizeV = mm[1] * 2;
          mSizeH = mm[0] + mm[2];
          break;
        case 2:
          mSizeV = mm[1] * 2;
          mSizeH = mm[0] * 2;
          break;
        default:
          mSizeV = mm[0] * 2;
          mSizeH = mm[0] * 2;
      }
    }

    let nw;
    let nh;

    if (alignment && React.Children.count(render)) {
      childrenHeight = findNestedSize(render, 'height');
      childrenWidth = findNestedSize(render, 'width');
      nw = margin ? mSizeH + childrenWidth : childrenWidth;
      nw = margin ? mSizeV + childrenHeight : childrenHeight;
    }

    nw = width ? mSizeH + width : width;
    nh = height ? mSizeV + height : height;

    return (
      <Node size={[nw, nh]} origin={origin} align={align}>
        {children}
      </Node>
    );
  }
);

function getAlignment(align) {
  if (align === undefined) return {};

  switch (align) {
    case 'left':
      return { align: [0, 0.5], origin: [0, 0.5] };
    case 'horizontalCenter':
      return { align: [0.5, 0.5], origin: [0.5, 0.5] };
    case 'right':
      return { align: [1, 0.5], origin: [1, 0.5] };
    case 'top':
      return { align: [0.5, 0], origin: [0.5, 0] };
    case 'verticalCenter':
      return { align: [0.5, 0.5], origin: [0.5, 0.5] };
    case 'bottom':
      return { align: [0.5, 1], origin: [0.5, 1] };
    case 'topLeft':
      return { align: [0, 0], origin: [0, 0] };
    case 'topCenter':
      return { align: [0.5, 0], origin: [0.5, 0] };
    case 'topRight':
      return { align: [1, 0], origin: [1, 0] };
    case 'centerLeft':
      return { align: [0, 0.5], origin: [0, 0.5] };
    case 'center':
      return { align: [0.5, 0.5], origin: [0.5, 0.5] };
    case 'centerRight':
      return { align: [1, 0.5], origin: [1, 0.5] };
    case 'bottomLeft':
      return { align: [0, 1], origin: [0, 1] };
    case 'bottomCenter':
      return { align: [0.5, 1], origin: [0.5, 1] };
    case 'bottomRight':
      return { align: [1, 1], origin: [1, 1] };
    default:
      return { align: [0.5, 0.5], origin: [0.5, 0.5] };
  }
}

function findNestedSize(children, prop) {
  const sizes = React.Children.map(children, (child) => {
    const size = child && child.props && child.props[prop];
    if (size) {
      return size;
    } else if (React.Children.count(child)) {
      return (child && child.props && child.props.children) || 0;
    }
  });

  const sizeNumber = sizes.filter((kk) => !isNaN(kk));

  if (sizeNumber.length) {
    return Math.max(...sizes);
  }

  const nestedChildren = sizes.filter((r) => isNaN(r));

  if (nestedChildren.length) {
    const nestedSizes = nestedChildren.map((child) => {
      return findNestedSize(child, prop);
    });

    return Math.max(...nestedSizes);
  }

  return 0;
}

function parseStringMargin(string) {
  return string
    .split(',')
    .filter((substr) => substr.length > 0)
    .map((str) => parseFloat(str))
    .filter((number) => !isNaN(number));
}
