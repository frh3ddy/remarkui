import React, { useContext } from "react";
import SamsaraContext from "../../samsaraContext";

export const Stroke = React.memo(
  React.forwardRef(({ color, width }, ref) => {
    const { surface } = useContext(SamsaraContext);
    let border;
    if (color || width) {
      if (color && width) {
        border = `${width}px solid ${color}`;
      } else if (color) {
        border = `solid ${color}`;
      } else {
        border = `${width}px solid`;
      }
    } else {
      border = "solid";
    }

    surface.setProperties({ outline: border });

    return null;
  })
);
