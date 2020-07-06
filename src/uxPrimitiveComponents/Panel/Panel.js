import React from 'react';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Rectangle } from '../Rectangle/Rectangle';
import { Alignment } from '../Shared/Alignment';

export const Panel = React.memo((props) => {
  const { children, margin, width, height, color, alignment } = props;

  if (color) {
    if (alignment) {
      return (
        <Alignment
          alignment={alignment}
          render={children}
          width={width}
          height={height}
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
    <Size width={width} height={height}>
      <Margin margin={margin}>{children}</Margin>
    </Size>
  );
});
