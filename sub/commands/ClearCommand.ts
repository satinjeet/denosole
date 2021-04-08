import { ICommand } from "../base/icommand.ts";
import { Command } from "./Command.ts";

export class ClearCommand extends Command implements ICommand {
    public alias = 'clear';

    help() {
        return "clear. Clears the screen.";
    }

    async exec(...args: any[]): Promise<string> {
        const process = Deno.run({ cmd: ['clear'] });
        await process.status();
        return "";
    }
}