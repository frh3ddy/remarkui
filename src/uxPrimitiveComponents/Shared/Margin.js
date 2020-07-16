import React from 'react';
import { Node } from '../../samsaraPrimitiveComponents/Node';

export const Margin = React.memo(({ children, margin }) => {
  if (margin) {
    let mSizeV = 0;
    let mSizeH = 0;
    let origin;
    let align;

    const mm = parseStringMargin(margin.toString());

    console.log(mm);

    switch (mm.length) {
      case 4:
        mSizeV = isNaN((mm[1] + mm[3]) / 2) ? 0 : (mm[1] + mm[3]) / 2;
        mSizeH = isNaN((mm[0] + mm[2]) / 2) ? 0 : (mm[0] + mm[2]) / 2;
        origin = [
          isNaN(mm[0] / (mm[0] + mm[2])) ? 0 : mm[0] / (mm[0] + mm[2]),
          isNaN(mm[1] / (mm[1] + mm[3])) ? 0 : mm[1] / (mm[1] + mm[3]),
        ];
        align = [
          isNaN(mm[0] / (mm[0] + mm[2])) ? 0 : mm[0] / (mm[0] + mm[2]),
          isNaN(mm[1] / (mm[1] + mm[3])) ? 0 : mm[1] / (mm[1] + mm[3]),
        ];
        break;
      case 3:
        mSizeV = mm[1];
        mSizeH = isNaN((mm[0] + mm[2]) / 2) ? 0 : (mm[0] + mm[2]) / 2;
        origin = [
          isNaN(mm[0] / (mm[0] + mm[2])) ? 0 : mm[0] / (mm[0] + mm[2]),
          0.5,
        ];
        align = [
          isNaN(mm[0] / (mm[0] + mm[2])) ? 0 : mm[0] / (mm[0] + mm[2]),
          0.5,
        ];
        break;
      case 2:
        mSizeV = mm[1];
        mSizeH = mm[0];
        origin = [0.5, 0.5];
        align = [0.5, 0.5];
        break;
      default:
        mSizeV = mm[0];
        mSizeH = mm[0];
        origin = [0.5, 0.5];
        align = [0.5, 0.5];
    }

    return (
      <Node align={align} origin={origin} margins={[mSizeH, mSizeV]}>
        {children}
      </Node>
    );
  }

  return children;
});

function parseStringMargin(string) {
  return string
    .split(',')
    .filter((substr) => substr.length > 0)
    .map((str) => parseFloat(str))
    .filter((number) => !isNaN(number));
}
