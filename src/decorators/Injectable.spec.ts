import { Injectable } from "./Injectable"
import { MetadataRegistry } from "../metadata/MetadataRegistry";

describe("@Injectable", () => {
  it("should register a target on MetadataRegistry", () => {
    @Injectable()
    class A { }
    expect(MetadataRegistry.has(A)).toBe(true);
  });

  it("should allow pass id parameter", () => {
    @Injectable("ClassA")
    class A { }

    expect(MetadataRegistry.getId(A)).toBe("ClassA");
  });
});
