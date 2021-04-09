import { ICommander } from "../base/icommander.ts";
import { ICommand } from "../base/icommand.ts";

import { HelpCommand } from "./HelpCommand.ts";
import { ClearCommand } from "./ClearCommand.ts";

import { decoder } from "../../utils/functions.ts";
import { log, LOG_LEVELS } from "../../utils/log.ts";

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

    autoComplete = async (cmd: string) => {
        const ttyLengthP = Deno.run({ cmd: ["stty", "size"], stdout: 'piped' })
        const [status, stdout] = await Promise.all([
            ttyLengthP.status(),
            ttyLengthP.output()
        ]);
        const [,charsAllowed] = decoder.decode(stdout).split(' ').map(_ => parseInt(_));

        
        const list = Object
        .keys(this.ListOfCommands)
        .filter(_ => _.includes(cmd));
        
        const tData: Array<Array<string>> = [];
        for (let i = 0; i < list.length; i = i+3) {
            const chunk: string[] = [];
            for (let j = 0; j < 3; j++) {
                if (list[i + j]) {
                    chunk.push(list[i + j])
                }
            }
            tData.push(chunk)
        }
        
        console.log(tData)
        console.table(tData)
        
        return list.join('\n');
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
