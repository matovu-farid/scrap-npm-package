// @ts-ignore
import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

// @ts-ignore
await emptyDir("./npm");
// @ts-ignore
await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  test: false,
  shims: {
    deno: true,
  },
  package: {
    name: "scrap-ai",
    version: Deno.args[0],
    description:
      "Scrap AI is a package that scrapes a website and returns the content",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/matovu-farid/scrap-npm-package.git",
    },
    bugs: {
      url: "https://github.com/matovu-farid/scrap-npm-package/issues",
    },
    dependencies: {
      axios: "^1.7.9",
      "json-canonicalize": "^1.0.6",
      zod: "^3.24.1",
      "zod-to-json-schema": "^3.24.3",
      ajv: "^8.17.1",
    },
  },
  devDependencies: {
    "@types/bun": "^1.2.4",
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
