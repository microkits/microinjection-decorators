import { Injectable } from "./Injectable";
import { MetadataRegistry } from "../metadata/MetadataRegistry";
import { SingletonScoped } from "./SingletonScoped";
import { Scope } from "@microkits/microinjection";

describe("@SingletonScoped", () => {
  it("should allow set scope to singleton in any order", () => {
    @SingletonScoped()
    @Injectable()
    class A { }

    @Injectable()
    @SingletonScoped()
    class B { }

    expect(MetadataRegistry.getScope(A)).toBe(Scope.SINGLETON);
    expect(MetadataRegistry.getScope(B)).toBe(Scope.SINGLETON);
  });
})