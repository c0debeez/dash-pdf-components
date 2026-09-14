import type { FunctionProps } from "../../props/generation/shared/dash";
const blocked = new Set([
  "__proto__",
  "prototype",
  "constructor",
  "eval",
  "caller",
  "callee",
  "arguments",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
]);
export function cloneJSON(value: any, depth = 0): any {
  if (depth > 32) throw new Error("Function options exceed 32 nesting levels.");
  if (value === null || ["boolean", "string"].includes(typeof value))
    return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map((v) => cloneJSON(v, depth + 1));
  if (
    !value ||
    typeof value !== "object" ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(value))
  )
    throw new Error("Function options must be JSON-safe.");
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (blocked.has(key))
        throw new Error(`Invalid function option key ${key}.`);
      return [key, cloneJSON(item, depth + 1)];
    }),
  );
}
export function isFunctionReference(value: any): value is FunctionProps {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "function")
  );
}
export function resolveFunction(
  reference: FunctionProps,
  context: Record<string, any> = {},
): (...args: any[]) => any {
  if (!isFunctionReference(reference) || typeof reference.function !== "string")
    throw new Error("Expected {function, options}.");
  const parts = reference.function.split(".");
  if (
    reference.function.length > 256 ||
    parts.length > 16 ||
    parts.some((p) => !/^[A-Za-z_$][\w$]*$/.test(p) || blocked.has(p))
  )
    throw new Error("Invalid function reference path.");
  let current: any = Object.getOwnPropertyDescriptor(
    window,
    "dashPdfRendererComponentsFunctions",
  )?.value;
  for (const part of parts)
    current = current && Object.getOwnPropertyDescriptor(current, part)?.value;
  if (typeof current !== "function")
    throw new Error(
      `Function ${reference.function} is not registered in window.dashPdfRendererComponentsFunctions.`,
    );
  const options = cloneJSON(reference.options ?? {});
  return (...args) => current(...args, options, context);
}
