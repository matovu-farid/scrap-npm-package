import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";
// @ts-ignore

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
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
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
