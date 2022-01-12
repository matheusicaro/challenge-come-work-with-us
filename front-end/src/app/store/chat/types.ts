export type Command = {
  type: string;
  value: string;
};

export type CommandStatus = {
  executed: boolean;
  command: Command;
};

type ChatStoreState = {
  commands: Array<CommandStatus>;
};

export default ChatStoreState;
