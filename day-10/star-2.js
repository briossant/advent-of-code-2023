const fs = require('fs');

if (process.argv.length < 4) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file> <Starting shape>")
    process.exit(1)
}

const to_map = {
    "|": [{x: 0, y: 1}, {x: 0, y: -1}],
    "-": [{x: 1, y: 0}, {x: -1, y: 0}],
    "J": [{x: -1, y: 0}, {x: 0, y: -1}],
    "L": [{x: 1, y: 0}, {x: 0, y: -1}],
    "F": [{x: 0, y: 1}, {x: 1, y: 0}],
    "7": [{x: 0, y: 1}, {x: -1, y: 0}],
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const W = lines[0].length;
const H = lines.length;


let S = lines
    .map((l, i) => {return {x: l.indexOf("S"), y: i}})
    .filter(e => e.x != -1)[0];

S.shape = process.argv[3];

let i_curr = 0;
let lvl = 0;

const queue = [];

queue.push(S);
queue.push(42)
lines[S.y][S.x] = lvl++;

while (i_curr < queue.length) {
    S = queue[i_curr++];
    if (S === 42) {
        if (i_curr == queue.length)
            break
        ++lvl;
        queue.push(42)
        continue
    }

    to_map[S.shape].forEach((offset) => {
        const new_coo = {x: S.x + offset.x, y: S.y + offset.y}
        new_coo.shape = lines[new_coo.y][new_coo.x];
        if (!Object.keys(to_map).includes(new_coo.shape))
            return;
        queue.push(new_coo)
        lines[new_coo.y][new_coo.x] = "X";
    });
}

console.log(lines.map(l => l.join("")).join("\n"))
console.log(lvl - 1)
