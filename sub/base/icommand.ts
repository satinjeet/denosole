export interface ICommand {
    alias: string;

    help(): string;
    exec(...args: any[]): Promise<string>;
}