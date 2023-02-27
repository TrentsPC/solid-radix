import { ComponentProps, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Slot } from "./Slot";

export type PrimitiveProps<T extends keyof JSX.IntrinsicElements> =
  ComponentProps<T> & { asChild?: boolean };

function createPrimitive<T extends keyof JSX.IntrinsicElements>(
  componentType: T
) {
  return (props: PrimitiveProps<T>) => {
    // @ts-ignore
    return (
      <Dynamic {...props} component={props.asChild ? Slot : componentType} />
    );
  };
}

export const Primitive = {
  a: createPrimitive("a"),
  button: createPrimitive("button"),
  div: createPrimitive("div"),
  h2: createPrimitive("h2"),
  h3: createPrimitive("h3"),
  img: createPrimitive("img"),
  label: createPrimitive("label"),
  li: createPrimitive("li"),
  nav: createPrimitive("nav"),
  ol: createPrimitive("ol"),
  p: createPrimitive("p"),
  span: createPrimitive("span"),
  svg: createPrimitive("svg"),
  ul: createPrimitive("ul"),
};
