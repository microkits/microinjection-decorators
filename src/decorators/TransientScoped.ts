
import { Scope } from "@microkits/microinjection";
import { MetadataRegistry } from "../metadata/MetadataRegistry";
import { ConcreteClass } from "../types";

export function TransientScoped<T>() {
  return function (target: ConcreteClass<T>) {
    MetadataRegistry.setScope(target, Scope.TRANSIENT);
  }
}
