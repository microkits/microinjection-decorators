import { RegistrationId } from "@microkits/microinjection";
import { ConcreteClass } from "../types";
import { MetadataRegistry } from "../metadata/MetadataRegistry";

export function Injectable<T>(id?: RegistrationId<T>) {
  return function (target: ConcreteClass<T>) {
    if (id == null) {
      id = target;
    }

    MetadataRegistry.setId(target, id);
  }
}