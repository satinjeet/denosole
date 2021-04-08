# DenoSole ( I will find a better name )

A simple console made on top of deno api. The goal is to have this console as a bootstrap to be used in any application to create a CLI for the application.

## Current Version: `v0.0.1`

## Use
To use this console in it's current state, you just need to include the main module and initialize the console.

```typescript
import { Console } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.1/console.ts";
import { toggleLog } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.1/utils/log.ts";
import { Commander } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.1/sub/commands/commander.ts";
import { Command } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.1/sub/commands/Command.ts";
import { ICommand } from "https://raw.githubusercontent.com/satinjeet/denosole/v0.0.1/sub/base/icommand.ts";

class LogCommand extends Command implements ICommand {
    alias = 'log';
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

class MyCommander extends Commander {
    commands = { ...LogCommand.Instance }
}

const commander = new MyCommander();

Console
    .initConfig({ welcomeMessage: "Welcome to my hood"} , { enable: true, level: 2 })
    .startConsole(commander.recieveCommand);
```

## More Documentation coming soon.
## Unit tests will be implemented soon.