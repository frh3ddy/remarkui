import React from 'react';
import { Node } from '../../samsaraPrimitiveComponents/Node';

export const Alignment = React.memo(
  ({ children, alignment, render, width, height, margin }) => {
    let childrenHeight;
    let childrenWidth;
    const { origin, align } = getAlignment(alignment);

    if (alignment && React.Children.count(render)) {
      if (
        alignment === 'top' ||
        alignment === 'verticalCenter' ||
        alignment === 'bottom'
      ) {
        childrenHeight = findHeight(render, 'height');
        childrenWidth = findHeight(render, 'width');
      } else if (
        alignment === 'center' ||
        alignment === 'topCenter' ||
        alignment === 'topLeft' ||
        alignment === 'topRight' ||
        alignment === 'centerLeft' ||
        alignment === 'centerRight' ||
        alignment === 'bottomLeft' ||
        alignment === 'bottomCenter' ||
        alignment === 'bottomRight'
      ) {
        childrenHeight = findHeight(render, 'height');
        childrenWidth = findHeight(render, 'width');
      } else {
        childrenWidth = findHeight(render, 'width');
      }
    }

    const nw = (margin || 0) * 2 + (width || childrenWidth || 0);
    const nh = (margin || 0) * 2 + (height || childrenHeight || 0);
    console.log(nw, nh);

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

function findHeight(children, prop) {
  const sizes = React.Children.map(children, (child) => {
    const size = child.props[prop];
    if (size) {
      return size;
    } else if (React.Children.count(child)) {
      return child.props.children;
    }
  });

  const sizeNumber = sizes.filter((kk) => !isNaN(kk));

  if (sizeNumber.length) {
    return Math.max(...sizes);
  }

  const nestedChildren = sizes.filter((r) => isNaN(r));

  if (nestedChildren.length) {
    const nestedSizes = nestedChildren.map((child) => {
      return findHeight(child, prop);
    });

    return Math.max(...nestedSizes);
  }

  return 0;
}
