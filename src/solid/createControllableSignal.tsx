import { Accessor, Setter, createSignal } from "solid-js";

type CreateControllableSignalParams<T> = {
  prop: Accessor<T | undefined>;
  defaultProp: Accessor<T | undefined>;
  onChange?: (state: T) => void;
};

export function createControllableSignal<T>({
  prop,
  defaultProp,
  onChange,
}: CreateControllableSignalParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = createSignal(defaultProp?.());
  const isControlled = () => prop() !== undefined;
  const value = () => (isControlled() ? prop() : uncontrolledProp());
  const handleChange = onChange;

  // @ts-ignore
  const setValue: Setter<T | undefined> = (nextValue) => {
    if (isControlled()) {
      const setter = nextValue as (value: T | undefined) => T;
      const value =
        typeof nextValue === "function" ? setter(prop()) : nextValue;
      if (value !== prop()) handleChange?.(value as T);
    } else {
      setUncontrolledProp(nextValue);
    }
  };

  return [value, setValue] as const;
}
