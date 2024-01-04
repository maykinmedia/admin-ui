import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/index.tsx",
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
    },
    plugins: [
      peerDepsExternal(),
      commonjs(),
      resolve(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        autoModules: true,
        extract: true,
        minimize: true,
        sourceMap: true,
      }),
      terser(),
    ],
  }
];
