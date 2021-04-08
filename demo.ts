#!.bin/deno run --unstable --allow-write --allow-read

import { Console } from "./console.ts";
import { toggleLog } from "./utils/log.ts";

// This is a function that receives a command from the console and executes it.
// This here will puposly wait 3 seconds before returning the result back to console.
function _TestCommander(cmd: string) {
    return new Promise<string>(res => {
        if (cmd == 'log') {
            // An example command "log"
            res(cmd + ": Logging is " + toggleLog() + "...");
        } else {
            // For the rest just print it out.
            setTimeout(res, 1000, cmd + ": Demo Output");
        }
    });
}

Console
    .initConfig({ welcomeMessage: "Welcome to my hood"} , { enable: true, level: 2 })
    .startConsole(_TestCommander);