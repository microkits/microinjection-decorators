import { Injectable } from "./Injectable";
import { MetadataRegistry } from "../metadata/MetadataRegistry";
import { TransientScoped } from "./TransientScoped";
import { Scope } from "@microkits/microinjection";

describe("@TransientScoped", () => {
  it("should allow set scope to singleton in any order", () => {
    @TransientScoped()
    @Injectable()
    class A { }

    @Injectable()
    @TransientScoped()
    class B { }

    expect(MetadataRegistry.getScope(A)).toBe(Scope.TRANSIENT);
    expect(MetadataRegistry.getScope(B)).toBe(Scope.TRANSIENT);
  });
})