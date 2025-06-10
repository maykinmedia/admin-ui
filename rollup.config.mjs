import { transform } from "@formatjs/ts-transformer";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import styles from "rollup-plugin-styler";
import postcss_url from "postcss-url";
import json from "@rollup/plugin-json";
import { dts } from "rollup-plugin-dts";

const EXTERNAL = [
  "@floating-ui/react",
  "@heroicons/react/24/outline",
  "@heroicons/react/24/solid",
  "clsx",
  "date-fns",
  "date-fns/locale",
  "react",
  "react-datepicker",
  "react-datepicker/dist/react-datepicker.css",
  "react-dom",
  "react-intl"
];

export default [
  {
    external: EXTERNAL,
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
        url: false,
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
      terser(),
      json()
    ]

  },
  {
    external: [...EXTERNAL, /\.scss$/],
    input: "src/index.ts",
    output: [{ dir: "dist/esm", format: "esm", preserveModules: true }],
    plugins: [dts()]
  },
  { input: "src/lib/i18n/compiled/en.json", output: { dir: "dist/esm/lib/i18n/compiled" }, plugins: [json()] },
  { input: "src/lib/i18n/compiled/nl.json", output: { dir: "dist/esm/lib/i18n/compiled" }, plugins: [json()] }
];
