import { log, setUp, LOG_LEVELS } from './utils/log.ts';
import { readKeypress, Keypress } from "./borrowed/keypress.ts";
import { encoder } from "./utils/functions.ts";
import { addToHistory } from './sub/history.ts';
import { CharacterHandlers } from "./sub/character_handlers.ts";
import { ICommand } from "./sub/base/icommand.ts";
import { Commander } from "./sub/commands/commander.ts";

type LogOptions = { file: string, level: LOG_LEVELS, enable: boolean };
type ConsoleOptions = { welcomeMessage: string, customConsoleChar: string };

export namespace Console {

    /**
     * Duh !!!!
     */
    const __version = "0.0.3";
    /**
     * Fancy
     */
    const _welcomeMain = `++++++++++++++++++++++++++++++++++++++++\n            DenoSole - ${__version}\n________________________________________\n`;
    /**
     * Default log file that this console will use.
     */
    const _logfile = ".denosole.log";

    /**
     * Useless flag. basically it controls whether everything is ready for it.
     */
    let _init = false;
    /**
     * Actual Welcome string to show. _welcome is something that will never go away ...
     * 
     * hu ha ha ha ha ha ha.....
     */
    let _welcome = _welcomeMain;

    let _consoleChar = "[dS] >_";

    const { stdin, stdout, stderr } = Deno;

    /**
     * This function reads the keypress and determine if something should go to the console and in memory command or not?
     * 
     * This behaviour is controlled by `CharacterHandlers.orderOfExecution` array of handlers.
     * 
     * TODO - Need a way to allow a customized order of Execution
     * 
     */
    async function _interveneIf(event: Keypress, command: string): Promise<CharacterHandlers.Output> {
        let _event: CharacterHandlers.Output = { command, key: "", extra: "" };
        for (const handler of CharacterHandlers.orderOfExecution) {
            const __event = handler(event, command);

            if (__event) {
                _event = { ..._event, ...__event  };
                break;
            }
        }

        return _event;
    }

    /**
     * Writes a fancy console character
     */
    async function _newConsole() {
        await writeToConsole(`${_consoleChar} `, true);
    }

    /**
     * Start here. Call initConfig on Console and then Start it.
     * 
     * it takes options to override the console and it's logging settings.
     * 
     * See demo.ts
     */
    export function initConfig(_consoleOptions: Partial<ConsoleOptions> = {}, _logOptions: Partial<LogOptions> = {}) {

        // Default values
        const consoleOptions = {
            ...{ welcomeMessage: "", customConsoleChar: _consoleChar },
            ..._consoleOptions
        }
        const logOptions: LogOptions = { 
            ...{ file: _logfile, level: LOG_LEVELS.INFO, enable: false},
            ..._logOptions
        };

        // setup log and other console properties
        setUp(logOptions.file, logOptions.enable, logOptions.enable, logOptions.level);
        _consoleChar = consoleOptions.customConsoleChar;
        _welcome = consoleOptions.welcomeMessage;
        _init = true;
        
        return Console;
    }

    /** 
     * Start the console. It takes an array of commands as it's argument. The commands must follow the structure of 
     * ICommand or you can inherit the Command Abstract class to use the predefined structure.
     */
    export async function startConsole(commands: ICommand[]): Promise<void> {

        const commander = Commander.createCommander(commands);

        if (!_init) {
            throw "Console not configured yet. Please call Console.initConfig to initialize some bootstrap code."
        }

        let command = "";
        await writeToConsole(_welcome, false);
        await writeToConsole(`version - ${__version}`, true);
        await _newConsole();
        for await ( const event of readKeypress() ) {
            
            // Let's see if console needs to intervene
            // If this key contributes to the command, then and only then the funtions will set the value to
            // rtVal.key
            const rtVal = await _interveneIf(event, command);

            log(2, rtVal, 'Event.....');

            if (event.key == 'return') {
                // Execute the command
                command = command.trim();
                if (command != "") {
                    await writeToConsole("", true, false);

                    const output = await commander.recieveCommand(command);

                    await writeToConsole(output, false, false);
                    addToHistory(command);
                    command = "";
                }
                await _newConsole();
            } else if (rtVal.key == 'clear') {
                command = command.trim();
                await rtVal.extra.status();
                await _newConsole();
                await writeToConsole(command, false, false);
            } else {
                // Write to console.
                command = rtVal.command
                await writeToConsole(rtVal.key);
            }
        }
    }

    export async function writeToConsole(str: string, pre_newline = false, post_newline = false) {
        str = pre_newline ? `\n${str}`: str;
        str = post_newline ? `${str}\n`: str;

        await stdout.write(encoder.encode(str));
    }

    export function writeToConsoleSync(str: string, pre_newline = false, post_newline = false) {
        str = pre_newline ? `\n${str}`: str;
        str = post_newline ? `${str}\n`: str;

        stdout.writeSync(encoder.encode(str));
    }
}