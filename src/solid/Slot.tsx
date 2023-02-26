import { JSX, children, createEffect, untrack } from "solid-js";
import {
  addEventListener,
  isServer,
  setAttribute,
  effect,
  DelegatedEvents,
} from "solid-js/web";

export type SlotProps = JSX.HTMLAttributes<HTMLElement>;

/**
 * Merges its props onto its immediate child.
 */
export function Slot(props: SlotProps) {
  // Get child
  const resolved = children(() => props.children);
  const el = resolved();

  // We only care about Single children
  if (!el) return el;
  if (typeof el !== "object") return el;
  if ("length" in el) {
    throw new Error(
      "`Slot` expects a single child, you provided " + el.length + ", Grr >:3"
    );
  }

  // Set ref
  const _ref$ = props.ref;
  if (_ref$ && !isServer) {
    typeof _ref$ === "function"
      ? use(_ref$, el)
      : (props.ref = el as HTMLElement);
  }

  Object.keys(props).forEach((key) => {
    // Ignore children
    if (key === "children") return;

    // Handle class
    if (key === "class") {
      createEffect(() => {
        let name = props[key];
        if (name) {
          (el as HTMLElement).className += " " + name;
        }
      });
      return;
    }

    // Handle verbatim events
    if (key.startsWith("on:")) {
      if (isServer) return;
      el.addEventListener(key.slice(3), (props as any)[key]);
      return;
    }

    // Handle events
    if (key.startsWith("on") && key.length > 2) {
      if (isServer) return;
      let thisEvent = (props as any)[key];
      let eventName = key.slice(2).toLowerCase();
      // Bound event
      if ("$$" + eventName + "Data" in el) {
        let childEvent = (el as any)["$$" + eventName] as
          | JSX.BoundEventHandler<HTMLElement, Event>
          | undefined;
        let childEventData = (el as any)["$$" + eventName + "Data"] as any;

        addEventListener(
          el as HTMLElement,
          eventName,
          // @ts-ignore
          (e: any) => {
            childEvent?.[0](childEventData, e);
            thisEvent(e);
          },
          DelegatedEvents.has(eventName)
        );
        return;
      }
      // Regular event
      if ("$$" + eventName in el) {
        let childEvent = (el as any)["$$" + eventName] as
          | JSX.EventHandler<HTMLElement, Event>
          | undefined;

        addEventListener(
          el as HTMLElement,
          eventName,
          // @ts-ignore
          (e: any) => {
            childEvent?.(e);
            thisEvent(e);
          },
          DelegatedEvents.has(eventName)
        );

        return;
      }

      addEventListener(
        el as HTMLElement,
        eventName,
        thisEvent,
        DelegatedEvents.has(eventName)
      );
      return;
    }

    // Handle attributes
    effect(() => setAttribute(el as HTMLElement, key, (props as any)[key]));
  });

  return el;
}

function use(fn: Function, element: HTMLElement | Node, arg?: any) {
  return untrack(() => fn(element, arg));
}
