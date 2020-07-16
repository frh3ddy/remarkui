import React, { useContext } from "react";
import SamsaraContext from "../../samsaraContext";

export const SolidColor = React.memo(
  React.forwardRef(({ color }, ref) => {
    const { surface } = useContext(SamsaraContext);
    surface.setProperties({ "background-color": color });

    return null;
  })
);
