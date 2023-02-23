import { JSX } from "solid-js/jsx-runtime";

/**
 * Merges its props onto its immediate child.
 */
export function Slot(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}
