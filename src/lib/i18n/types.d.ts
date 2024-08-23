export type MessageRecord = Record<string, MessageDescriptor>;

export type MessageDescriptor = {
  id?: string;
  description?: string;
  defaultMessage?: string;
};
