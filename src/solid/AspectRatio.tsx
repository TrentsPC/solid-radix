import { JSX, splitProps } from "solid-js";
import { Primitive, PrimitiveProps } from "./Primitive";

type AspectRatioProps = Omit<PrimitiveProps<"div">, "style"> & {
  ratio?: number;
  style?: JSX.CSSProperties;
};

function AspectRatio(props: AspectRatioProps) {
  const [_, rest] = splitProps(props, ["ratio", "style"]);
  return (
    <div
      style={{
        // ensures inner element is contained
        position: "relative",
        // ensures padding bottom trick maths works
        width: "100%",
        "padding-bottom": `${100 / (props.ratio || 1)}%`,
      }}
      data-radix-aspect-ratio-wrapper=""
    >
      <Primitive.div
        {...rest}
        style={{
          ...props.style,
          // ensures children expand in ratio
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export { AspectRatio };
export type { AspectRatioProps };
