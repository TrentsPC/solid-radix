import {
  JSX,
  children,
  createEffect,
  createRenderEffect,
  untrack,
} from "solid-js";
import { isServer } from "solid-js/web";

// Not too fond of how much i had to copy out of `solid-js/web`, but ssr seemed to break if i just imported

const DelegatedEvents = /*#__PURE__*/ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart",
]);

export type SlotProps = JSX.HTMLAttributes<HTMLElement>;

/**
 * Merges its props onto its immediate child.
 */
export function Slot(props: SlotProps) {
  // Get child
  const resolved = children(() => props.children);

  createRenderEffect(() => {
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
      if (key === "ref") return;

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
      createEffect(() =>
        setAttribute(el as HTMLElement, key, (props as any)[key])
      );
    });
  });

  return <>{resolved()}</>;
}

function use(fn: Function, element: HTMLElement | Node, arg?: any) {
  return untrack(() => fn(element, arg));
}

function setAttribute(node: Element, name: string, value: any) {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}

function addEventListener(
  node: any,
  name: string,
  handler: JSX.EventHandlerUnion<any, any>,
  delegate: boolean
) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(
      name,
      (handler[0] = (e: any) => handlerFn.call(node, handler[1], e))
    );
  } else node.addEventListener(name, handler);
}
