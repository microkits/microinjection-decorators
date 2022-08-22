import { RegistrationId, Scope } from "@microkits/microinjection";

export interface ClassPropertyMetadata<T> {
  name: string | symbol;
  inject: RegistrationId<T>;
  required?: boolean;
  value?: unknown;
}

export interface ClassDependencyMetadata<T> {
  index: number;
  inject: RegistrationId<T>;
  required?: boolean;
  value?: unknown;
}

export interface Metadata<T = unknown> {
  id?: RegistrationId<T>;
  scope?: Scope;
  properties?: ClassPropertyMetadata<T>[];
  dependencies?: ClassDependencyMetadata<T>[];
}