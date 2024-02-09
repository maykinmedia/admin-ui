const fs = require("fs");
const argv = require("yargs").argv;

// load the existing catalog to prevent overwriting messages
let existingCatalog = null;
try {
  existingCatalog = JSON.parse(fs.readFileSync(argv.outFile, "utf-8"));
} catch (e) {}

const format = (messages) => {
  Object.entries(messages).forEach(([id, msg]) => {
    // always store the original default message as a reference
    msg.originalDefault = msg.defaultMessage;

    // if the message with the ID is already in the catalog, re-use it
    const existingMsg = existingCatalog && existingCatalog[id];
    if (!existingMsg) return;
    msg.defaultMessage = existingMsg.defaultMessage;
    if (existingMsg.isTranslated) {
      msg.isTranslated = true;
    }
  });
  return messages;
};

exports.format = format;
