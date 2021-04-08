import { Keypress } from '../borrowed/keypress.ts';
import { Console } from "../console.ts";
import { log } from '../utils/log.ts';

export namespace CharacterHandlers {

    export type Output = { command: string, key: string };
    export type ExpectedOutput = Partial<Output> | void | undefined | null;
    export type PExpectedOutput = ExpectedOutput;
    
    /**
     * @TODO maybe move space to it's own handler?
     */
    export function handleCharKeys(event: Keypress, command: string): PExpectedOutput {
        // If the input from keyboard is not a single character
        const input = event.key || "";
        log(2, input, "INPUT <<<");
        if (
            input !== 'space' && (
                input.length > 1 ||
                event.ctrlKey ||
                event.metaKey
            )
        ) {
            log(2, `${input} Not Handled in char keys`);
            return undefined;
        }

        log(2, `${input} Handled in char keys`);
        
        return {
            command: command + (input == 'space' ? ' ': input),
            key: (input == 'space' ? ' ': input)
        };
    }
    
    export function handleBackspace(event: Keypress, command: string): PExpectedOutput {
    
        if (event.key == 'backspace') {
            log(2, "Handled in backspace");
            if (command != "")
            Console.writeToConsoleSync('\b \b');
            return { command: command.substring(0, command.length - 1), key: "" };
        };
    
    }
    
    export function handleCrtl(event: Keypress, command: string): PExpectedOutput {
        if (!event.ctrlKey) return;

        log(2, "in ctrl handler");
        if ((event.key == "c" || event.key == "d")) {
            log(2, "Handled in ctrl");
            Console.writeToConsoleSync(`Bye Bye !!`, true);
            Deno.exit(0);
        }
    
        return { command: command, key: "" };
    }

    export const orderOfExecution = [
        handleCrtl,
        handleBackspace,
        handleCharKeys,
    ];
}