import { encoder } from './functions.ts';

/**
 * LOG Levels Enum
 */
export enum LOG_LEVELS {
    INFO = 0,
    DEBUG = 1,
    ERROR = 2,
    ALL = 3
}

/**
 * Filename for the log
 */
let _fileName: string;
/**
 * File object to use for writing
 */
let _file: Deno.File;
/**
 * Switch to turn the logging on/off
 */
let _write = false;
/**
 * Allowed Log Level
 */
let _logLevel = LOG_LEVELS.INFO;

/**
 * Internal Function to create the log file. It can also latch on to an existing file if it is there.
 */
function _createFile() {
    try {
        Deno.createSync(_fileName);
    } catch (e) {
        console.log(e);
    }
    _file = Deno.openSync(_fileName, { append: true });
}

/**
 * Bootstrap Logger
 */
export function setUp(fileName: string, createFile: boolean = true, startWriting: boolean = false, logLevel: LOG_LEVELS = LOG_LEVELS.INFO): void {
    _fileName = fileName;
    _write = startWriting;
    _logLevel = logLevel;
    createFile && _createFile();
}

/**
 * Toggles the log during runtime
 */
export function toggleLog(preference: boolean): string {
    _write = preference;
    
    return _write ? 'Enabled': 'Disabled';
}

/**
 * Function to actually log something. Call it with a log level and message.
 * 
 * To distinct your message, pass in an unique ID.
 * 
 * If the file does not exists, we shall not create it at runtime at the moment.
 */
export function log(level: number, msg: string | any, id: string = "Log: "): void {
    if (level > _logLevel) return;

    _write && 
    _file &&
    _file.writeSync(
        encoder.encode(
            '\n'+ id + " >> " + JSON.stringify(msg)
        )
    );
}