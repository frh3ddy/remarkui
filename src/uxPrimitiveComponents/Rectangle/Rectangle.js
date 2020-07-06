import React from 'react';
import { SurfaceComponent } from '../../samsaraPrimitiveComponents/Surface';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Node } from '../../samsaraPrimitiveComponents/Node';
import { Alignment } from '../Shared/Alignment';

export const Rectangle = React.memo(
  ({ children, margin, width, height, color, alignment }) => {
    const properties = { 'background-color': color };

    if (alignment) {
      if (margin) {
        return (
          <Alignment
            alignment={alignment}
            render={children}
            width={width}
            height={height}
          >
            <Margin margin={margin}>
              <SurfaceComponent properties={properties}>
                {children}
              </SurfaceComponent>
            </Margin>
          </Alignment>
        );
      }

      return (
        <Alignment
          alignment={alignment}
          render={children}
          width={width}
          height={height}
        >
          <SurfaceComponent properties={properties}>
            {children}
          </SurfaceComponent>
        </Alignment>
      );
    }

    const content = (
      <Node>
        <SurfaceComponent properties={properties}>{children}</SurfaceComponent>
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
