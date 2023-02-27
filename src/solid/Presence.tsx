import { JSX, Show, children, createMemo, createSignal } from "solid-js";
import { isServer } from "solid-js/web";

function nextFrame(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

function hasAnimation(el: HTMLElement) {
  return (
    window
      .getComputedStyle(el as HTMLElement)
      .getPropertyValue("animation-name") !== "none"
  );
}

export function Presence(props: { visible: boolean; children: JSX.Element }) {
  let first = true;
  const [show, setShow] = createSignal(props.visible);
  const resolved = children(() => props.children);

  let child = createMemo(() => {
    // return props.children;
    let el = resolved() as Element;
    while (typeof el === "function") el = (el as Function)();

    if (!isServer) {
      function endTransition(e?: Event) {
        el.removeEventListener("transitionend", endTransition);
        el.removeEventListener("animationend", endTransition);

        setShow(props.visible);
      }

      if (props.visible) {
        el.removeEventListener("transitionend", endTransition);
        el.removeEventListener("animationend", endTransition);
        setShow(true);
        nextFrame(() => {
          el.removeEventListener("transitionend", endTransition);
          el.removeEventListener("animationend", endTransition);
          setShow(true);
        });
      } else {
        if (!first) {
          nextFrame(() => {
            el.addEventListener("transitionend", endTransition);
            el.addEventListener("animationend", endTransition);

            nextFrame(() => {
              if (!hasAnimation(el as HTMLElement)) {
                endTransition();
              }
            });
          });
        }
      }
      first = false;
    }
    return el;
  });

  return <Show when={show()}>{child}</Show>;
}
