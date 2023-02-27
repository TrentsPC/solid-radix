import { splitProps } from "solid-js";
import { Primitive, PrimitiveProps } from "./Primitive";

const DEFAULT_ORIENTATION = "horizontal";
const ORIENTATIONS = ["horizontal", "vertical"] as const;

type Orientation = typeof ORIENTATIONS[number];

type SeparatorProps = PrimitiveProps<"div"> & {
  /**
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
};

function Separator(props: SeparatorProps) {
  const [, domProps] = splitProps(props, ["decorative", "orientation"]);
  const orientation = () => props.orientation || DEFAULT_ORIENTATION;
  const ariaOrientation = () =>
    props.orientation === "vertical" ? orientation() : undefined;

  return (
    <Primitive.div
      data-orientation={orientation}
      role={props.decorative ? "none" : "separator"}
      aria-orientation={ariaOrientation()}
      {...domProps}
    />
  );
}

export { Separator };
export type { SeparatorProps };
