import { Scope } from "@microkits/microinjection";
import { MetadataRegistry } from "../metadata/MetadataRegistry";
import { ConcreteClass } from "../types";

export function ContextScoped<T>() {
  return function (target: ConcreteClass<T>) {
    MetadataRegistry.setScope(target, Scope.CONTEXT);
  }
}
