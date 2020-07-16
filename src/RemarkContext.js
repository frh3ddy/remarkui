import React, { useEffect, useRef } from 'react';
import SamsaraContext from './samsaraContext';
import samsara from 'samsarajs';

const {
  DOM: { Context },
} = samsara;

const context = new Context();

const RemarkContext = ({ children }) => {
  const refEl = useRef(null);
  useEffect(() => {
    if (refEl.current) {
      context.mount(refEl.current);
    }
  }, [refEl]);
  return (
    <SamsaraContext.Provider value={{ context }}>
      <div ref={refEl}>{children}</div>
    </SamsaraContext.Provider>
  );
};

export default RemarkContext;
