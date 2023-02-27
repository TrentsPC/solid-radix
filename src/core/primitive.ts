import { JSX } from "solid-js";

function composeEventHandlers<T, E extends Event>(
  originalEventHandler?: JSX.EventHandlerUnion<T, E>,
  ourEventHandler?: JSX.EventHandler<T, E>,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    if (originalEventHandler) {
      if (typeof originalEventHandler === "function") {
        (originalEventHandler as any)(event as any);
      }
      // else {
      //   originalEventHandler?.[1]?.(event as any);
      // }
    }

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event as any);
    }
  };
}

export { composeEventHandlers };
