import { Keypress } from '../borrowed/keypress.ts';
import { Console } from "../console.ts";
import { log, LOG_LEVELS } from '../utils/log.ts';

export namespace CharacterHandlers {

    export type Output = { command: string, key: string, extra: any };
    export type ExpectedOutput = Partial<Output> | void | undefined | null;
    export type PExpectedOutput = ExpectedOutput;

    export function handleTab(event: Keypress, command: string): PExpectedOutput {
        if (event.key == 'tab') {
            log(LOG_LEVELS.DEBUG, event, "TAB..");
            return { command: command, key: "hint" }
        }
        return;
    }
    
    /**
     * @TODO maybe move space to it's own handler?
     */
    export function handleCharKeys(event: Keypress, command: string): PExpectedOutput {
        // If the input from keyboard is not a single character
        const input = event.key || "";
        log(LOG_LEVELS.DEBUG, input, "INPUT <<<");
        if (
            input !== 'space' && (
                input.length > 1 ||
                event.ctrlKey ||
                event.metaKey
            )
        ) {
            log(LOG_LEVELS.DEBUG, `${input} Not Handled in char keys`);
            return undefined;
        }

        log(LOG_LEVELS.DEBUG, `${input} Handled in char keys`);
        
        return {
            command: command + (input == 'space' ? ' ': input),
            key: (input == 'space' ? ' ': input)
        };
    }
    
    export function handleBackspace(event: Keypress, command: string): PExpectedOutput {
    
        if (event.key == 'backspace') {
            log(LOG_LEVELS.DEBUG, "Handled in backspace");
            if (command != "")
                Console.writeToConsoleSync('\b \b');

            return { command: command.substring(0, command.length - 1), key: "" };
        };
    
    }
    
    export function handleCrtl(event: Keypress, command: string): PExpectedOutput {
        if (!event.ctrlKey) return;

        log(LOG_LEVELS.DEBUG, "in ctrl handler");
        if ((event.key == "c" || event.key == "d")) {
            log(LOG_LEVELS.DEBUG, "Handled in ctrl");
            Console.writeToConsoleSync(`Bye Bye !!`, true);
            Deno.exit(0);
        }

        if (event.key == "l") {
            const process = Deno.run({ cmd: ['clear'] });
            return { command: command, key: "clear", extra: process };
        }
    
        return { command: command, key: "clear" };
    }

    export const orderOfExecution = [
        handleTab,
        handleCrtl,
        handleBackspace,
        handleCharKeys,
    ];
}