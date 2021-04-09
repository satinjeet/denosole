#!.bin/deno run --unstable --allow-write --allow-read --allow-run -q

import { Console } from "./console.ts";
import { toggleLog } from "./utils/log.ts";
import { Command } from "./sub/commands/Command.ts";

// This is a function that receives a command from the console and executes it.
class LogCommand extends Command {
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

const otherCommand = {
    alias: 'foo',
    help() { return "A foo command. this is the holy grail of commands :smile:"; },
    async exec(...args: string[]) {
        return `${this.alias} was called with ${args.join(' ')}`;
    }
}

Console
    .initConfig({ welcomeMessage: "Welcome to my hood"} , { enable: true, level: 2 })
    .startConsole([
        new LogCommand,
        otherCommand
    ]);