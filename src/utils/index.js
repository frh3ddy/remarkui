export const getTransition = (props, backwards) => {
  let {
    duration = 0,
    easing,
    damping = 0.5,
    velocity = 0,
    drag = 0.1,
    period = 100,
    easingBack,
    durationBack,
  } = props;

  if (backwards) {
    if (durationBack) {
      duration = durationBack;
    }

    if (easingBack) {
      easing = easingBack;
    }
  }

  switch (easing) {
    case "spring":
      return { curve: easing, velocity, damping, period };
    case "inertia":
      return { curve: easing, velocity, drag };
    case "damp":
      return { curve: easing, damping };
    default:
      return { curve: easing, duration };
  }
};
