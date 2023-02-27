import { JSX } from "solid-js";
import { Slot } from "./Slot";
import { VisuallyHidden } from "./VisuallyHidden";

type AccessibleIconProps = {
  children?: JSX.Element;
  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   */
  label: string;
};

function AccessibleIcon(props: AccessibleIconProps) {
  return (
    <>
      {/* @ts-ignore */}
      <Slot aria-hidden="true" focusable="false">
        {props.children}
      </Slot>
      <VisuallyHidden>{props.label}</VisuallyHidden>
    </>
  );
}

export { AccessibleIcon };
export type { AccessibleIconProps };
