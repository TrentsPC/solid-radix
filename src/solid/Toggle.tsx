import { splitProps } from "solid-js";
import { Primitive, PrimitiveProps } from "./Primitive";
import { createControllableSignal } from "./createControllableSignal";
import { composeEventHandlers } from "../core/primitive";

type ToggleProps = PrimitiveProps<"button"> & {
  /**
   * The controlled state of the toggle.
   */
  pressed?: boolean;
  /**
   * The state of the toggle when initially rendered. Use `defaultPressed`
   * if you do not need to control the state of the toggle.
   * @defaultValue false
   */
  defaultPressed?: boolean;
  /**
   * The callback that fires when the state of the toggle changes.
   */
  onPressedChange?: (pressed: boolean) => void;
};

function Toggle(props: ToggleProps) {
  const [, buttonProps] = splitProps(props, [
    "pressed",
    "defaultPressed",
    "onPressedChange",
  ]);

  const [pressed, setPressed] = createControllableSignal({
    prop: () => props.pressed,
    onChange: props.onPressedChange,
    defaultProp: () => props.defaultPressed || false,
  });

  return (
    <Primitive.button
      type="button"
      aria-pressed={pressed() || false}
      data-state={pressed() ? "on" : "off"}
      data-disabled={props.disabled ? "" : undefined}
      {...buttonProps}
      onClick={composeEventHandlers(props.onClick, () => {
        if (!props.disabled) {
          setPressed(!pressed);
        }
      })}
    />
  );
}

export { Toggle };
export type { ToggleProps };
