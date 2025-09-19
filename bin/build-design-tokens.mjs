import { readFileSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import StyleDictionary from "style-dictionary";

const VERBOSITY = "verbose";
const ROOT = "src/design-tokens";
const TOKENS = join(ROOT, "tokens");
const BASE = join(TOKENS, "base");
const COMPONENTS = join(TOKENS, "components");
const THEMES = join(TOKENS, "themes");
const COMPILED = join(ROOT, "compiled");
const THEMES_OUT = join(COMPILED, "themes");
const FONT_PUBLIC_PATH = "/src/fonts/";

const sd = (cfg) =>
  new StyleDictionary({ log: { verbosity: VERBOSITY }, ...cfg });

StyleDictionary.registerFormat({
  name: "css/font-face-from-asset-json",
  format: ({ dictionary }) => {
    const blocks = dictionary.allTokens
      .filter(
        (t) =>
          t.path[0] === "asset" && t.path[1] === "font" && t.type === "font",
      )
      .map((t) => {
        const [, , family, weight, style] = t.path;
        const fmts = Array.isArray(t.formats)
          ? t.formats
          : t.original?.formats || ["woff2"];
        const src = fmts
          .map(
            (f) => `url("${FONT_PUBLIC_PATH}${t.value}.${f}") format("${f}")`,
          )
          .join(", ");
        return [
          "@font-face {",
          `  font-family: "${family}";`,
          `  font-style: ${style};`,
          `  font-weight: ${weight};`,
          `  font-display: swap;`,
          `  src: ${src};`,
          "}",
        ].join("\n");
      });
    return blocks.join("\n\n") + (blocks.length ? "\n" : "");
  },
});

StyleDictionary.registerFormat({
  name: "css/variables-with-scheme",
  format: ({ dictionary, options }) => {
    const scheme = options?.colorScheme === "dark" ? "dark" : "light";
    const selectorLight = options?.selectorLight ?? ":root";
    const selectorDark = options?.selectorDark ?? ':root[data-mode="dark"]';
    const addMediaFallback = options?.addMediaFallback ?? true;

    const isColorSchemeToken = (t) =>
      Array.isArray(t.path) && t.path.includes("color-scheme");

    const lines = dictionary.allTokens
      .filter((t) => !isColorSchemeToken(t))
      .map((t) => `  --${t.name}: ${t.value};`);

    if (scheme === "light") {
      return `${selectorLight} {\n${lines.join("\n")}\n}\n`;
    }

    let out = `${selectorDark} {\n${lines.join("\n")}\n}\n`;

    if (addMediaFallback) {
      out += `\n@media (prefers-color-scheme: dark) {\n  ${selectorLight}:not([data-mode]) {\n${lines.join("\n")}\n  }\n}\n`;
    }
    return out;
  },
});

const themeFiles = readdirSync(THEMES).filter((f) => f.endsWith(".json"));
if (!themeFiles.length) throw new Error(`No theme files in ${THEMES}`);

await sd({
  source: [join(BASE, "assets.json")],
  platforms: {
    web: {
      transformGroup: "css",
      buildPath: `${COMPILED}/`,
      files: [
        { destination: "fonts.css", format: "css/font-face-from-asset-json" },
      ],
    },
  },
}).buildAllPlatforms();

{
  const base = sd({
    include: [join(BASE, "**/*.json"), join(COMPONENTS, "**/*.json")],
  });

  for (const file of themeFiles) {
    const name = basename(file, extname(file));
    const themePath = join(THEMES, file);
    const themeJson = JSON.parse(readFileSync(themePath, "utf8"));
    const colorScheme =
      themeJson?.theme?.["color-scheme"] ??
      themeJson?.["color-scheme"] ??
      themeJson?.meta?.["color-scheme"] ??
      "light";

    const themed = await base.extend({
      source: [themePath],
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: `${THEMES_OUT}/`,
          files: [
            {
              destination: `${name}.css`,
              format: "css/variables-with-scheme",
              options: {
                colorScheme,
                selectorLight: ":root",
                selectorDark: ':root[data-mode="dark"]',
                addMediaFallback: true,
              },
              filter: (t) =>
                typeof t.filePath === "string" &&
                t.filePath.includes("/tokens/themes/"),
            },
          ],
        },
      },
    });

    await themed.buildAllPlatforms();
  }
}

await sd({
  source: [
    join(BASE, "**/*.json"),
    join(COMPONENTS, "**/*.json"),
    join(THEMES, themeFiles[0]),
  ],
  platforms: {
    web: {
      transformGroup: "css",
      buildPath: `${COMPILED}/`,
      files: [
        {
          destination: "vars.css",
          format: "css/variables",
          options: { outputReferences: true },
          filter: (t) =>
            !(t.path[0] === "asset" && t.path[1] === "font") &&
            !(
              typeof t.filePath === "string" &&
              t.filePath.includes("/tokens/themes/")
            ),
        },
      ],
    },
  },
}).buildAllPlatforms();
