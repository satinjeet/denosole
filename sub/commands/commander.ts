import { ICommander } from "../base/icommander.ts";
import { ICommand } from "../base/icommand.ts";

import { HelpCommand } from "./HelpCommand.ts";
import { ClearCommand } from "./ClearCommand.ts";

export abstract class Commander implements ICommander {

    protected _defaultcommands: { [key: string]: ICommand } = {
        ...HelpCommand.Instance,
        ...ClearCommand.Instance,
    };

    abstract commands: { [key: string]: ICommand };

    private get ListOfCommands(): { [key: string]: ICommand } {
        return {
            ...this._defaultcommands,
            ...this.commands
        }
    }

    recieveCommand = async (cmd: string) => {

        let [alias, ...args] = cmd.split(' ');

        const command = this.ListOfCommands[alias];

        if (command) {
            if (args[0] == 'help') {
                return command.help()
            } else {
                return command.exec(...args);
            }
        } else {
            return `Invalid command: ${cmd}, try help.`;
        }

    }

    public static createCommander(commands: ICommand[]): Commander {
        const commander = new class extends Commander {
            commands = Object.fromEntries(commands.map(_ => [_.alias, _]));
        }

        return commander;
    }
}
