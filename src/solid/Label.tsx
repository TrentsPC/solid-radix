import { Dynamic } from "solid-js/web";
import { Primitive, PrimitiveProps } from "./Primitive";

export type LabelProps = PrimitiveProps<"label">;

export function Label(props: LabelProps) {
  return (
    <Primitive.label
      {...props}
      onMouseDown={(event) => {
        if (typeof props.onMouseDown === "function") {
          props.onMouseDown(event);
        }
        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }}
    />
  );
}
