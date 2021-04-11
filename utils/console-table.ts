import { decoder } from "./functions.ts";

export async function renderToTable(entries: string[], columns: number) {
    const groups: Array<string> = [];

    const ttyLengthP = Deno.run({ cmd: ["stty", "size"], stdout: 'piped' })
        const [status, stdout] = await Promise.all([
            ttyLengthP.status(),
            ttyLengthP.output()
        ]);
    const [,charsAllowed] = decoder.decode(stdout).split(' ').map(_ => parseInt(_));

    const maxLengthPerColumn = Math.floor(charsAllowed/columns);

    for (let i = 0; i < entries.length; i = i + columns) {
        const group: string[] = [];
        for (let j = 0; j < columns; j++) {
            const cmd = entries[i+j]
            if (cmd) {
                group.push( cmd + " ".repeat(maxLengthPerColumn - cmd.length) );
            }
        }
        groups.push(group.join("")); 
    }

    return groups.join('\n');

    // let maxLengths = [0, 0, 0];
    // for (let group of groups) {
    //     const _maxLengths = [...group, "", ""].slice(0, 3).map(_ => _.length);
    //     maxLengths = _maxLengths.map((_, i) => _ >= maxLengths[i] ? _: maxLengths[i]);
    // }
}