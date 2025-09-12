import StyleDictionary from "style-dictionary";
import fs from "node:fs";
import path from "node:path";

const THEMES_DIR = "src/design-tokens/tokens/themes";
  const themeFiles = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith(".json"));
  const themeName = f => path.basename(f, ".json");

  StyleDictionary.registerTransform({
    name: "attribute/font",
    type: "attribute",
    transform: (prop) => ({
      category: prop.path[0],
      type: prop.path[1],
      family: prop.path[2],
      weight: prop.path[3],
      style: prop.path[4],
    }),
  });

  const BASE = ["attribute/cti", "color/css", "name/kebab"];

  StyleDictionary.registerFormat({
    name: "css/vars-block",
    format: ({ dictionary, options }) => {
      const { selector = ":root" } = options;

      const refMap = new Map(
        dictionary.allTokens.map(t => [t.path.join("."), `--${t.name}`])
      );
      const replaceRefs = (raw) =>
        String(raw).replace(/\{([^}]+)\}/g, (_, key) => {
          const cssVar = refMap.get(key);
          return cssVar ? `var(${cssVar})` : `var(--${key.replace(/\./g, "-")})`;
        });

      const lines = dictionary.allTokens
        .filter(t => t.type !== "font")
        .map(t => {
          const raw = t.original && t.original.value != null ? t.original.value : t.value;
          return `  --${t.name}: ${replaceRefs(raw)};`;
        });

      if (!lines.length) return "";
      return `${selector} {\n${lines.join("\n")}\n}\n`;
    },
  });


  StyleDictionary.registerFormat({
    name: "font-face",
    format: ({ dictionary: { allTokens }, options }) => {
      const fontPathPrefix = options.fontPathPrefix || "../";
      const formatsMap = {
        woff2: "woff2",
        woff: "woff",
        ttf: "truetype",
        otf: "opentype",
        svg: "svg",
        eot: "embedded-opentype",
      };
      return allTokens
        .filter(t => t.type === "font")
        .map(t => {
          const fam = t.attributes.family;
          const w = t.attributes.weight;
          const s = t.attributes.style;
          const urls = (t.formats || []).map(
            ext => `url("${fontPathPrefix}${t.value}.${ext}") format("${formatsMap[ext]}")`
          );
          return [
            "@font-face {",
            `  font-family: "${fam}";`,
            `  font-style: ${s};`,
            `  font-weight: ${w};`,
            `  src: ${urls.join(",\n       ")};`,
            `  font-display: fallback;`,
            `}`,
          ].join("\n");
        })
        .join("\n\n");
    },
  });

  export default {
    include: ["src/design-tokens/tokens/**/*.json"],
    source: themeFiles.map(f => `${THEMES_DIR}/${f}`),
    platforms: {
      "css/properties": {
        transforms: BASE,
        buildPath: "src/design-tokens/compiled/",
        files: [
          {
            destination: "properties.css",
            format: "css/vars-block",
            options: { selector: ":root" },
            filter: (t) => t.type !== "font" && !t.filePath.includes("/themes/"),
          },
        ],
      },

      "css/fonts": {
        transforms: ["attribute/cti", "attribute/font", "name/kebab"],
        buildPath: "src/design-tokens/compiled/",
        files: [
          {
            destination: "fonts.css",
            format: "font-face",
            options: { fontPathPrefix: "/src/fonts/" },
            filter: (t) => t.type === "font",
          },
        ],
      },

      "css/themes": {
        transforms: BASE,
        buildPath: "src/design-tokens/compiled/themes/",
        files: themeFiles.map((f) => {
          const name = themeName(f);
          return {
            destination: `${name}.css`,
            format: "css/vars-block",
            options: { selector: ":root" },
            filter: (t) => t.filePath.endsWith(`/themes/${f}`),
          };
        }),
      },

      tokens: {
        transforms: ["attribute/cti", "color/css", "name/kebab"],
        buildPath: "src/design-tokens/compiled/themes",
        files: themeFiles.map((f) => {
          const name = themeName(f);
          return {
            destination: `${name}.json`,
            format: "json",
            filter: (t) => t.filePath.endsWith(`/themes/${f}`),
          };
        }
        ),
      },
    },
  };
