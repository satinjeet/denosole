import { ICommand } from "../base/icommand.ts";

export abstract class Command implements ICommand {
    abstract alias: string;
    abstract exec(...args: any[]): Promise<string>;
    abstract help(): string;

    static get Instance(): { [key: string]: ICommand } {
        const Klass = this as any;
        const instance: ICommand = new Klass();
        return { [instance.alias]: instance };
    }

}