import React, { useLayoutEffect, useContext, useRef, useMemo } from 'react';
import SamsaraContext from '../samsaraContext';
import samsara from 'samsarajs';

const {
  DOM: { Surface },
} = samsara;

const renderChildren = (children, ref) => {
  if (typeof children === 'string') {
    ref.current = children;
    return null;
  }

  return React.Children.map(children, (child, i) => {
    let el = React.cloneElement(child, {
      ref,
    });
    return el;
  });
};

export const SurfaceComponent = React.memo(
  React.forwardRef((props, ref) => {
    const { node, context } = useContext(SamsaraContext);

    const parentNode = context || node;
    const renderedDiv = useRef(null);
    const { children, ...surfaceProperties } = props;

    const surface = useMemo(() => {
      const newSurface = new Surface({
        ...surfaceProperties,
      });
      parentNode.add(newSurface);
      return newSurface;
    }, []);

    useLayoutEffect(() => {
      surface.setContent(renderedDiv.current);
      return () => {
        surface.remove();
      };
    }, []);

    return (
      <SamsaraContext.Provider value={{ surface, node: parentNode }}>
        <React.Fragment>{renderChildren(children, renderedDiv)}</React.Fragment>
      </SamsaraContext.Provider>
    );
  })
);

SurfaceComponent.displayName = 'Surface';
