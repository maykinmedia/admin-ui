import StyleDictionary from "style-dictionary";


StyleDictionary.registerTransform({
  name: "attribute/font",
  type: "attribute",
  transform: prop =>
    ({
      category: prop.path[0],
      type: prop.path[1],
      family: prop.path[2],
      weight: prop.path[3],
      style: prop.path[4]
    })
});

StyleDictionary.registerFormat({
  name: "font-face",
  format: ({ dictionary: { allTokens }, options }) => {
    const fontPathPrefix = options.fontPathPrefix || "../";

    // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
    const formatsMap = {
      "woff2": "woff2",
      "woff": "woff",
      "ttf": "truetype",
      "otf": "opentype",
      "svg": "svg",
      "eot": "embedded-opentype"
    };

    return allTokens.reduce((fontList, prop) => {
      const {
        attributes: { family, weight, style },
        formats,
        value: path
      } = prop;

      const urls = formats
        .map(extension => `url("${fontPathPrefix}${path}.${extension}") format("${formatsMap[extension]}")`);

      const fontCss = [
        "@font-face {",
        `\n\tfont-family: "${family}";`,
        `\n\tfont-style: ${style};`,
        `\n\tfont-weight: ${weight};`,
        `\n\tsrc: ${urls.join(",\n\t\t\t ")};`,
        "\n\tfont-display: fallback;",
        "\n}\n"
      ].join("");

      fontList.push(fontCss);

      return fontList;
    }, []).join("\n");
  }
});

export default {
  source: [
    "src/design-tokens/tokens/*.json"
  ],
  platforms: {
    "css/properties": {
      transforms: ["attribute/color", "color/hsl-4", "name/kebab"],
      buildPath: "src/design-tokens/compiled/",
      files: [
        {
          destination: "properties.css",
          filter: (token) => token.type !== "font",
          format: "css/variables",
          options: {
            outputReferences(token) {
              return token.attributes.outputReferences !== false;
            }
          }
        }
      ]
    },
    "css/fonts": {
      transforms: ["attribute/color", "attribute/font", "name/kebab"],
      buildPath: "src/design-tokens/compiled/",
      files: [
        {
          destination: "fonts.css",
          filter: (token) => token.type === "font",
          format: "font-face",
          options: {
            fontPathPrefix: "/src/fonts/"
          }
        }
      ]
    },
    "tokens": {
      transforms: ["attribute/color", "attribute/cti", "color/hsl-4", "name/kebab"],
      buildPath: "src/design-tokens/compiled/",
      files: [
        {
          destination: "tokens.json",
          format: "json",
        }
      ]
    },
  }
};
