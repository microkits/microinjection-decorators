import { Scope, RegistrationId } from "@microkits/microinjection";
import { AnyClass } from "../types";
import { ClassDependencyMetadata, Metadata, ClassPropertyMetadata } from "./MetadataRegistry.types";

export abstract class MetadataRegistry {
  private static metadata = new Map<unknown, Metadata>();

  /**
   * It takes a target and a name, and sets the scope property of the metadata object associated with
   * the target
   * @param target - The class that is being decorated.
   * @param {Scope} scope - Scope - The scope of the dependency.
   */
  static setScope<T>(target: AnyClass<T>, scope: Scope): void {
    const metadata = this.metadata.get(target) ?? {} as Metadata;
    metadata.scope = scope;
    this.metadata.set(target, metadata);
  }

  /**
   * It takes a target and a name, and sets the name property of the metadata object associated with
   * the target
   * @param target - The class that is being decorated.
   * @param {string} name - The name of the property.
   */
  static setId<T>(target: AnyClass<T>, id: RegistrationId<T>): void {
    const metadata = this.metadata.get(target) ?? {} as Metadata;
    metadata.id = id;
    this.metadata.set(target, metadata);
  }

  /**
   * It adds a property to the metadata.
   * @param target - The class that is being decorated.
   * @param {ClassPropertyMetadata} property - ClassPropertyMetadata
   */
  static addProperty<T>(target: AnyClass<T>, property: ClassPropertyMetadata<T>): void {
    const metadata = this.metadata.get(target) ?? {} as Metadata;

    if (metadata.properties == null) {
      metadata.properties = [];
    }

    metadata.properties.push(property);
    this.metadata.set(target, metadata);
  }

  /**
   * It adds a dependency to the metadata of a class
   * @param target - The class that is being decorated.
   * @param {ClassDependencyMetadata} dependency - ClassDependencyMetadata
   */
  static addDependency<T>(target: AnyClass<T>, dependency: ClassDependencyMetadata<T>): void {
    const metadata = this.metadata.get(target) ?? {} as Metadata;

    if (metadata.dependencies == null) {
      metadata.dependencies = [];
    }

    metadata.dependencies.push(dependency);
    metadata.dependencies.sort((a, b) => a.index - b.index);

    this.metadata.set(target, metadata);
  }

  /**
   * It returns the stored id of the class that is passed in as a parameter
   * @param target - The class that we want to get the id of.
   * @returns The id of the class.
   */
  static getId<T>(target: AnyClass<T>): RegistrationId<T> {
    const metadata = this.metadata.get(target);
    return metadata?.id as RegistrationId<T>;
  }

  /**
   * Get the scope of the given class.
   * @param target - The class that we want to get the scope for.
   * @returns The scope of the target class.
   */
  static getScope<T>(target: AnyClass<T>): Scope {
    const metadata = this.metadata.get(target);
    return metadata?.scope;
  }

  /**
   * It returns the dependencies of a given class
   * @param target - The class that we want to get the dependencies for.
   * @returns An array of ClassDependencyMetadata objects.
   */
  static getDependencies<T>(target: AnyClass<T>): ClassDependencyMetadata<T>[] {
    const metadata = this.metadata.get(target) as Metadata<T>;
    return metadata?.dependencies ?? [];
  }

  /**
   * "Get the properties of the target class, and then get the properties of the parent class, and then
   * concatenate them together."
   * 
   * The `getProperties` function is recursive, which means it calls itself. It calls itself until it
   * reaches the `Object` class, which is the base class of all classes
   * @param target - AnyClass<T>
   * @returns An array of ClassPropertyMetadata objects.
   */
  static getProperties<T>(target: AnyClass<T>): ClassPropertyMetadata<T>[] {
    if (target == Object.prototype) {
      return [];
    }

    const metadata = this.metadata.get(target) as Metadata<T>;

    return this.getProperties<T>(
      Object.getPrototypeOf(target)
    ).concat(metadata?.properties ?? []);
  }

  /**
   * It deletes the metadata for the given target
   * @param target - The class that you want to add metadata to.
   * @returns A boolean value indicating whether the metadata was successfully deleted.
   */
  static delete<T>(target: AnyClass<T>): boolean {
    return this.metadata.delete(target);
  }

  /**
   * It returns true if the target class has metadata, and false if it doesn't
   * @param target - The class that we want to check if it has metadata.
   * @returns A boolean value.
   */
  static has<T>(target: AnyClass<T>): boolean {
    return this.metadata.has(target);
  }
}
