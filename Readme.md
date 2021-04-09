# DenoSole ( I will find a better name )

A simple console made on top of deno api. The goal is to have this console as a bootstrap to be used in any application to create a CLI for the application.

## Current Version: `0.0.3`

## Use
To use this console in it's current state, you just need to include the main module and initialize the console.

```typescript
import { Console } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.3/console.ts";
import { toggleLog } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.3/utils/log.ts";
import { Command } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.3/sub/commands/Command.ts";

// Create an Command instance from Command Class. you don't need to, we can simply have a structured object with needed properties and methods,
// but is nice to have if you need some sort of instance level control.
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

// This is a plain object with the needed command structure.
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
```

## More Documentation coming soon.
## Unit tests will be implemented soon.