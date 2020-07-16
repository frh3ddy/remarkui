import React from 'react';
import { SurfaceComponent } from '../../samsaraPrimitiveComponents/Surface';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';

export const Text = React.memo(
  React.forwardRef(
    (
      {
        children,
        margin,
        width,
        height,
        color,
        background,
        textAlignment,
        lineSpacing,
        font,
      },
      ref
    ) => {
      const properties = {
        color: color,
        font: font,
        'background-color': background,
        'text-align': textAlignment,
        'line-height': lineSpacing,
      };

      if (
        margin > (width || Number(!width)) ||
        margin > (height || Number(!height))
      ) {
        return (
          <Size width={width} height={height}>
            <SurfaceComponent properties={properties}>
              {children}
            </SurfaceComponent>
          </Size>
        );
      }

      return (
        <Size width={width} height={height}>
          <Margin margin={margin}>
            <SurfaceComponent properties={properties}>
              {children}
            </SurfaceComponent>
          </Margin>
        </Size>
      );
    }
  )
);
