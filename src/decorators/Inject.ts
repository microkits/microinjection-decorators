import { RegistrationId } from "@microkits/microinjection";
import { InjectDecoratorError } from "../errors/InjectDecoratorError";
import { AnyClass } from "../types";
import { MetadataRegistry } from "../metadata/MetadataRegistry";

export function Inject<T>(inject: RegistrationId<T>);
export function Inject<T>(inject: RegistrationId<T>): ParameterDecorator | PropertyDecorator {
  return function (target, property, index): void {
    if (index == null) {
      MetadataRegistry.addProperty(target.constructor as AnyClass, {
        name: property, inject
      });

      return;
    }

    if (property == null) {
      MetadataRegistry.addDependency(target as AnyClass, {
        index, inject
      });

      return
    }

    throw new InjectDecoratorError();
  }
}
