import { AbstractModule, Container } from "@microkits/microinjection";
import { MetadataRegistry } from "./metadata/MetadataRegistry";
import { DecoratorsModuleOptions } from "./DecoratorsModule.types";
import fs from "fs";
import path from "path";

export class DecoratorsModule extends AbstractModule {
  private readonly path: string;

  constructor(options: DecoratorsModuleOptions) {
    super()
    this.path = options.path;
  }

  async configure(container: Container): Promise<void> {
    const files = fs
      .readdirSync(this.path)
      .map(file => path.join(process.cwd(), this.path, file));

    for (const file of files) {
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const module = await import(file);

        for (const key in module) {
          const target = module[key];

          if (target instanceof Function) {
            if (MetadataRegistry.has(target)) {
              container
                .register(
                  MetadataRegistry.getId(target)
                )
                .asClass(target, {
                  properties: MetadataRegistry.getProperties(target),
                  dependencies: MetadataRegistry.getDependencies(target)
                })
                .inScope(
                  MetadataRegistry.getScope(target)
                );
            }
          }
        }
      }
    }
  }
}