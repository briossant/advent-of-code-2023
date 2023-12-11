const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const to_map = {
    "|": [[0, 1], [0, -1]],
    "-": [[1, 0], [-1, 0]],
    "J": [[-1, 0], [0, -1]],
    "L": [[1, 0], [0, -1]],
    "F": [[0, 1], [1, 0]],
    "7": [[0, 1], [-1, 0]],
    "S": [[1, 0], [-1, 0], [0, 1], [0, -1]],
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const W = lines[0].length;
const H = lines.length;


let S = lines
    .map((l, i) => [i, l.indexOf("S")])
    .filter(e => e[1] != -1)[0];
S.push("S")

let i_curr = 0;
let lvl = 0;

const queue = [];

queue.push(S);
queue.push(42)
lines[S[0]][S[1]] = lvl++;

while (i_curr < queue.length) {
    S = queue[i_curr++];
    if (S === 42) {
        if (i_curr == queue.length)
            break
        ++lvl;
        queue.push(42)
        continue
    }
    to_map[S[2]].forEach(([x_off, y_off]) => {
        const [y, x] = [S[0] + y_off, S[1] + x_off]
        if (y < 0 || x < 0 || x >= W || y >= H)
            return;
        if (!Object.keys(to_map).includes(lines[y][x]))
            return;
        queue.push([y, x, lines[y][x]])
        lines[y][x] = "X";
    });
}

console.log(lines.map(l => l.join("")).join("\n"))
console.log(lvl - 1)
