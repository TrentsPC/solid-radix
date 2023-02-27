import { JSX } from "solid-js";
import { Primitive, PrimitiveProps } from "./Primitive";

type VisuallyHiddenProps = Omit<PrimitiveProps<"span">, "style"> & {
  style?: JSX.CSSProperties;
};

function VisuallyHidden(props: VisuallyHiddenProps) {
  return (
    <Primitive.span
      {...props}
      style={{
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: "absolute",
        border: "0",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        "white-space": "nowrap",
        "word-wrap": "normal",
        ...props.style,
      }}
    />
  );
}

export { VisuallyHidden };
export type { VisuallyHiddenProps };
