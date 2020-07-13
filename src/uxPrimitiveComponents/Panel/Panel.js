import React from 'react';
import { Margin } from '../Shared/Margin';
import { Size } from '../Shared/Size';
import { Rectangle } from '../Rectangle/Rectangle';
import { Alignment } from '../Shared/Alignment';

export const Panel = React.memo((props) => {
  const { children, margin, width, height, color, alignment } = props;

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
      <Alignment
        alignment={alignment}
        render={children}
        width={width}
        height={height}
        margin={margin}
      >
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

function parseStringMargin(string) {
  return string
    .split(',')
    .filter((substr) => substr.length > 0)
    .map((str) => parseFloat(str))
    .filter((number) => !isNaN(number));
}
