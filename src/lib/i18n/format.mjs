import fs from "fs";
import yargs from "yargs";


// load the existing catalog to prevent overwriting messages
const argv = yargs(process.argv).argv;
try {
  const existingCatalog = JSON.parse(fs.readFileSync(argv.outFile, "utf-8"));
} catch (e) {
  if (!process.argv.includes("compile-folder")) {
    console.error(e);
    process.exit(1);
  }
}


/**
 * Used by `npm run makemessages`.
 * @param messages
 * @return {*}
 */
export function format(messages) {
  Object.entries(messages).forEach(([id, msg]) => {
    // always store the original default message as a reference
    msg.originalDefault = msg.defaultMessage;

    // if the message with the ID is already in the catalog, re-use it
    const existingMsg = existingCatalog && existingCatalog[id];

    if (!existingMsg) {
      return;
    }

    msg.defaultMessage = existingMsg.defaultMessage;

    if (existingMsg.isTranslated) {
      msg.isTranslated = true;
    }
  });
  return messages;
};

/**
 * Used by `npm run compilemessages`.
 * @param messages
 * @return {{[p: string]: undefined}}
 */
export function compile(messages) {
  return Object.fromEntries(
    Object.entries(messages).map(([key, message]) => [key, message.defaultMessage])
  );
}
