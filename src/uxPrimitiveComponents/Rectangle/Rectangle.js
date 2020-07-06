import React from 'react';
import { SurfaceComponent } from '../../samsaraPrimitiveComponents/Surface';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Node } from '../../samsaraPrimitiveComponents/Node';
import { Alignment } from '../Shared/Alignment';

export const Rectangle = React.memo(
  ({ children, margin, width, height, color, alignment }) => {
    const properties = { 'background-color': color };
    const nw = width !== undefined ? (margin || 0) * 2 + width : undefined;
    const nh = height !== undefined ? (margin || 0) * 2 + height : undefined;

    if (alignment) {
      if (margin) {
        return (
          <Alignment
            alignment={alignment}
            render={children}
            width={nw}
            height={nh}
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
          width={nw}
          height={nh}
        >
          <SurfaceComponent properties={properties}>
            {children}
          </SurfaceComponent>
        </Alignment>
      );
    }

    return (
      <Size width={nw} height={nh}>
        <Margin margin={margin}>
          <Node>
            <SurfaceComponent properties={properties}>
              {children}
            </SurfaceComponent>
          </Node>
        </Margin>
      </Size>
    );
  }
);
