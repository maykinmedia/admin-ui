import { transform } from "@formatjs/ts-transformer";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import styles from "rollup-plugin-styler";
import postcss_url from "postcss-url";
import json from "@rollup/plugin-json";
// import { dts } from "rollup-plugin-dts";

export default [
  {
    external: ["react", "react-dom", "@floating-ui/react", "@heroicons/react/24/outline", "@heroicons/react/24/solid", "clsx"],
    input: "src/index.ts",
    output: [{
      assetFileNames: "[name][extname]",
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      preserveModules: true
    }, {
      assetFileNames: "[name][extname]",
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true
    }],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      typescript({
        transformers: () => ({
          before: [
            transform({
              overrideIdFn: "[sha512:contenthash:base64:6]",
              ast: true
            })
          ]
        }), tsconfig: "./tsconfig.json"
      }),
      styles({
        mode: "extract",
        minimize: true,
        sourceMap: true,
        plugins: [
          postcss_url({
            basePath: process.cwd(),
            url: "inline"
          })
        ]
      }),
      terser()
    ]

  },
  // FIXME: Replaced with "moduleResolution": "bundler",
  // {
  //   input: "dist/esm/index.js",
  //   output: [{ file: "dist/types//index.d.ts", format: "esm" }],
  //   external: [/\.scss$/],
  //   plugins: [dts()]
  // },
  { input: "src/lib/i18n/compiled/en.json", output: { dir: "dist/esm/lib/i18n/compiled",  }, plugins: [json()] },
  { input: "src/lib/i18n/compiled/nl.json", output: { dir: "dist/esm/lib/i18n/compiled" }, plugins: [json()] }
];
