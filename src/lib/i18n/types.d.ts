import nl from "./compiled/nl.json";

export type Messages = typeof nl;

export type MessageRecord = Record<string, MessageDescriptor>;

export type MessageDescriptor = {
  id?: keyof Messages;
  description?: string;
  defaultMessage?: string;
};
