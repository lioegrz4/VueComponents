const modKeys = ["Control", "Alt", "Meta", "Shift"]

export default function ({ instruction, cursor, value, history }) {
    let [cmd, key] = instruction
    if (cmd === 'insert' && modKeys.indexOf(key) >= 0) return

    console.log(instruction)
}