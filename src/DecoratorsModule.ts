import { AbstractModule, Container } from "@microkits/microinjection";
import { MetadataRegistry } from "./metadata/MetadataRegistry";
import { DecoratorsModuleOptions } from "./DecoratorsModule.types";
import fs from "fs";
import path from "path";

export class DecoratorsModule extends AbstractModule {
  private readonly path: string;

  constructor(options?: DecoratorsModuleOptions) {
    super()
    this.path = options?.path ?? __dirname;
  }

  private getFiles = (directory: string, files?: string[]) => {
    files = files || []

    fs.readdirSync(directory).forEach((file) => {
      if (fs.statSync(directory + "/" + file).isDirectory()) {
        files = this.getFiles(directory + "/" + file, files)
      } else {
        files.push(path.join(directory, "/", file))
      }
    });

    return files;
  }

  async configure(container: Container): Promise<void> {
    const files = this.getFiles(this.path);

    for (const filename of files) {
      if (
        !filename.match(/\.[jt]s$/) ||
        filename.endsWith('.js.map') ||
        filename.endsWith('.d.ts') ||
        filename.startsWith('.') ||
        filename.match(/index\.[jt]s$/)
      ) {
        continue;
      }

      const module = await import(filename);

      for (const key in module) {
        const target = module[key];

        if (target instanceof Function) {
          if (MetadataRegistry.has(target)) {
            container.register(
              MetadataRegistry.getId(target)
            ).asClass(target, {
              properties: MetadataRegistry.getProperties(target),
              dependencies: MetadataRegistry.getDependencies(target)
            }).inScope(
              MetadataRegistry.getScope(target)
            );
          }
        }
      }
    }
  }
}