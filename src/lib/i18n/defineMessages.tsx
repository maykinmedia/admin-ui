import { MessageRecord } from "./types";

/**
 * Fallback implementation in case react-intl is not installed.
 * @param messages
 */
export const defineMessages = <T extends MessageRecord>(messages: T): T =>
  messages;
