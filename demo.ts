#!.bin/deno run --unstable --allow-write --allow-read --allow-run

import { Console } from "./console.ts";
import { toggleLog } from "./utils/log.ts";
import { Commander } from "./sub/commands/commander.ts";
import { ICommand } from "./sub/base/icommand.ts";

// This is a function that receives a command from the console and executes it.
class MyCommander extends Commander {
    commands = {
        'log': new class implements ICommand {
            alias =  'log';
            help() {
                return 'log <on | off> to turn the logging on and off.'
            }
            exec = async (...args: string[]) => {
                const arg = args[0];
                if (!arg) {
                    return `${this.alias} needs an argument. try log on|off`;
                } else {
                    return `Logging is ${toggleLog(arg == 'on')}.`;
                }
            }
        }
    }
}

const commander = new MyCommander();

Console
    .initConfig({ welcomeMessage: "Welcome to my hood"} , { enable: true, level: 2 })
    .startConsole(commander.recieveCommand);