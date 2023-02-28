import { JSX, children, createRenderEffect } from "solid-js";
import { spread } from "solid-js/web";

export type SlotProps = JSX.HTMLAttributes<HTMLElement>;

/**
 * Merges its props onto its immediate child.
 */
export function Slot(props: SlotProps) {
  const resolved = children(() => props.children);

  createRenderEffect(() => {
    const el = resolved();
    // We only care about Single children
    if (!el) return;
    if (typeof el !== "object") return;
    if ("length" in el) {
      throw new Error(
        "Solid Radix: `Slot` expects a single child, you provided " +
          el.length +
          ", Grr >:3"
      );
    }

    spread(el as Element, props, false, true);
  });

  return <>{resolved()}</>;
}
