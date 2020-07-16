import React from 'react';
import { SurfaceComponent } from '../../samsaraPrimitiveComponents/Surface';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Node } from '../../samsaraPrimitiveComponents/Node';
import { Alignment } from '../Shared/Alignment';

export const Rectangle = React.memo(
  ({ children, margin, width, height, color, alignment }) => {
    const properties = { 'background-color': color };

    let mSizeV = 0;
    let mSizeH = 0;

    if (margin) {
      const mm = parseStringMargin(margin.toString());

      switch (mm.length) {
        case 4:
          mSizeV = mm[1] + mm[3];
          mSizeH = mm[0] + mm[2];
          break;
        case 3:
          mSizeV = mm[1] * 2;
          mSizeH = mm[0] + mm[2];
          break;
        case 2:
          mSizeV = mm[1] * 2;
          mSizeH = mm[0] * 2;
          break;
        default:
          mSizeV = mm[0] * 2;
          mSizeH = mm[0] * 2;
      }
    }

    const nw = width !== undefined ? mSizeH + width : undefined;
    const nh = height !== undefined ? mSizeV + height : undefined;

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

function parseStringMargin(string) {
  return string
    .split(',')
    .filter((substr) => substr.length > 0)
    .map((str) => parseFloat(str))
    .filter((number) => !isNaN(number));
}
