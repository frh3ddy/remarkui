import React from 'react';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Rectangle } from '../Rectangle/Rectangle';
import { Alignment } from '../Shared/Alignment';

export const Panel = React.memo((props) => {
  const { children, margin, width, height, color, alignment } = props;
  const nw = width !== undefined ? (margin || 0) * 2 + width : undefined;
  const nh = height !== undefined ? (margin || 0) * 2 + height : undefined;

  if (color) {
    if (alignment) {
      return (
        <Alignment
          alignment={alignment}
          render={children}
          width={width}
          height={height}
          margin={margin}
        >
          <Rectangle children={children} color={color} margin={margin} />
        </Alignment>
      );
    }
    return <Rectangle {...props} children={children} />;
  }

  if (alignment) {
    return (
      <Alignment alignment={alignment} render={children}>
        <Margin margin={margin}>{children}</Margin>
      </Alignment>
    );
  }

  return (
    <Size width={nw} height={nh}>
      <Margin margin={margin}>{children}</Margin>
    </Size>
  );
});
