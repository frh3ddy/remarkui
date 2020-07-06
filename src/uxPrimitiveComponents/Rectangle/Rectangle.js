import React from 'react';
import { SurfaceComponent } from '../../samsaraPrimitiveComponents/Surface';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Node } from '../../samsaraPrimitiveComponents/Node';

export const Rectangle = React.memo(
  ({ children, margin, width, height, color, order }) => {
    const properties = { 'background-color': color };

    const content = (
      <Node>
        <SurfaceComponent properties={properties} order={order}>
          {children}
        </SurfaceComponent>
      </Node>
    );

    if (
      margin > (width || Number(!width)) ||
      margin > (height || Number(!height))
    ) {
      return (
        <Size width={width} height={height}>
          {content}
        </Size>
      );
    }
    return (
      <Size width={width} height={height}>
        <Margin margin={margin}>{content}</Margin>
      </Size>
    );
  }
);
