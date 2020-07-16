import React, { useLayoutEffect, useContext, useMemo } from 'react';
import SamsaraContext from '../samsaraContext';
import samsara from 'samsarajs';

const {
  Core: { Transform },
} = samsara;

export const Node = React.memo(
  React.forwardRef((props, ref) => {
    const { node, context } = useContext(SamsaraContext);

    let parentNode = context || node;

    let { children, ...nodeProperties } = props;

    const newNode = useMemo(() => {
      return parentNode.add(nodeProperties);
    }, []);

    useLayoutEffect(() => {
      return () => {
        newNode.remove();
      };
    }, []);

    return (
      <SamsaraContext.Provider value={{ node: newNode }}>
        {children}
      </SamsaraContext.Provider>
    );
  })
);
