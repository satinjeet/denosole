const history: string[] = [];
let pointer: number | undefined = undefined;

export function getHistory() {
    return { history, pointer };
}

export function addToHistory(command: string) {
    history.push(command);
    pointer = history.length;
}

export function fromHistory(modifier: -1 | 1 = -1) {
    pointer = pointer || history.length;
    pointer += modifier;

    const item = history[pointer];
    return item || "";
}
