export type AnyClass<T = unknown> = (
  abstract new (...args: unknown[]) => T
);
export type ConcreteClass<T = unknown> = (
  new (...args: unknown[]) => T
);