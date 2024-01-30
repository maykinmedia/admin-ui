import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import postcss_url from "postcss-url";

export default [
  {
    external: ["@floating-ui/react", "@heroicons/react/24/outline", "@heroicons/react/24/solid", "clsx"],
    input: "src/index.tsx",
    output: {
      dir: "dist",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
    },
    plugins: [
      peerDepsExternal(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        autoModules: true,
        extract: true,
        minimize: true,
        sourceMap: true,
        plugins: [
          postcss_url({
            basePath: process.cwd(),
            url: 'inline'
          }),
        ],
      }),
      terser(),
    ],
  }
];
