import { AbstractModule, Container } from "@microkits/microinjection";
import { glob } from "glob";
import { DecoratorsModuleOptions } from "./DecoratorsModule.types";
import { MetadataRegistry } from "./metadata/MetadataRegistry";
import path from "path";

export class DecoratorsModule extends AbstractModule {
  private readonly basePath: string;
  private include: string[];
  private exclude: string[];

  constructor(options?: DecoratorsModuleOptions) {
    super();
    this.basePath = options?.basePath ?? __dirname;
    this.include = options?.include ?? [
      "**/*.ts",
      "**/*.js"
    ];
    this.exclude = options?.exclude ?? [
      "**/*.spec.ts",
      "**/*.test.ts",
      "**/*.js.map",
      "**/*.d.ts",
      "**/.*",
      "**/index.js",
      "**/index.ts"
    ]
  }

  private getFiles = () => {
    const options = {
      cwd: this.basePath,
      ignore: this.exclude,
      nodir: true
    };

    const files = new Set<string>();

    this.include.forEach(pattern => {
      glob.sync(pattern, options).forEach(file => {
        files.add(path.join(this.basePath, file));
      });
    });

    return Array.from(files);
  }

  async configure(container: Container): Promise<void> {
    const files = this.getFiles();

    for (const filename of files) {

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