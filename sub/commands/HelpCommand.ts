import { ICommand } from "../base/icommand.ts";
import { Command } from "./Command.ts";

export class HelpCommand extends Command implements ICommand {
    public alias = 'help';

    help() {
        return "Help needs no help!!";
    }

    async exec(...args: any[]): Promise<string> {
        return "Help is empty baby!!";
    }
}