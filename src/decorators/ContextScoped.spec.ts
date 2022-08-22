import { Scope } from "@microkits/microinjection";
import { Injectable } from "./Injectable";
import { MetadataRegistry } from "../metadata/MetadataRegistry";
import { ContextScoped } from "./ContextScoped";

describe("@ContextScoped", () => {
  it("should allow set scope to singleton in any order", () => {
    @ContextScoped()
    @Injectable()
    class A { }

    @Injectable()
    @ContextScoped()
    class B { }

    expect(MetadataRegistry.getScope(A)).toBe(Scope.CONTEXT);
    expect(MetadataRegistry.getScope(B)).toBe(Scope.CONTEXT);
  });
})