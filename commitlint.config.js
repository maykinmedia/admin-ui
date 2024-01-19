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

module.exports = {
  plugins: ["commitlint-plugin-function-rules"],
  rules: {
    "header-full-stop": [2, "never"],
    "function-rules/header-max-length": [
      2, // level: error
      "always",
      /**
       * Override header-max-length to provide pattern matching for commit headers.
       * Format should be: ":gitmoji: #ticket - type: description
       * @param header
       * @return {[boolean,string]}
       */
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
        q;
      },
    ],
  },
};
