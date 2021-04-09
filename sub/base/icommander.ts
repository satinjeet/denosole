/** @deprecated */
import { ICommand } from "./icommand.ts";

export interface ICommander {
  commands: { [key: string]: ICommand };
  recieveCommand: (cmd: string) => Promise<string>;
}