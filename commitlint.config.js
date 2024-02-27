/**
 * @example: :sparkles: #1 - feat: implement new feature
 * @see {@link https://regexr.com/7qm0o RegExr}
 * @type {RegExp}
 */
const COMMIT_PATTERN =
  /(:\w+\:)(?:\s+(#\d+))?\s-\s([\w\s]+)(?:\((\w+)\))?:\s(.+)/;

// We can't use commitlint type enum here due to gitmoji.
const TYPE_ENUM = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "style",
  "refactor",
  "perf",
  "test",
];

/**
 * Simple commitlint plugin that allows a custom function to be executed.
 * @type {{rules: {functionRule: (function(*, *, *): *)}}}
 */
const functionRulePlugin = {
  rules: {
    functionRule: (parsed, when, value) => {
      if (typeof value !== "function") {
        throw new Error(value, "is not a function!");
      }
      return value(parsed, when);
    },
  },
};

module.exports = {
  plugins: [functionRulePlugin],
  rules: {
    "header-full-stop": [2, "never"],
    functionRule: [
      2,
      "always",
      ({ header }) => {
        const match = header.match(COMMIT_PATTERN);

        if (match) {
          const [header, gitmoji, ticket, type, scope, description] = match;
          if (!TYPE_ENUM.includes(type)) {
            // Message match but type is not in TYPE_ENUM.
            return [false, `${type} is not in ${TYPE_ENUM.join(", ")}`];
          }

          // Message matched.
          return [true, ""];
        }

        // Message did not match format.
        return [
          false,
          "Commit message format invalid: \n\nFormat: <gitmoji>[ [ticket]] - <type>[([optional scope])]: <description>.\nExample: :sparkles: #1 - feat: implement new feature",
        ];
      },
    ],
  },
};
