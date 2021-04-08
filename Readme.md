# DenoSole ( I will find a better name )

A simple console made on top of deno api. The goal is to have this console as a bootstrap to be used in any application to create a CLI for the application.

## Current Version: `pre-v0.0.1`

## Use
To use this console in it's current state, you just need to include the main module and initialize the console.

```typescript
import { Console } from "https://raw.githubusercontent.com/satinjeet/denosole/pre-v0.0.1/console.ts";
import { toggleLog } from "https://raw.githubusercontent.com/satinjeet/denosole/pre-v0.0.1/utils/log.ts";

// Example command
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
```

## More Documentation coming soon.
## Unit tests will be implemented soon.