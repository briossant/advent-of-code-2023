const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const to_map = {
    "|": [{x: 0, y: 1}, {x: 0, y: -1}],
    "-": [{x: 1, y: 0}, {x: -1, y: 0}],
    "J": [{x: -1, y: 0}, {x: 0, y: -1}],
    "L": [{x: 1, y: 0}, {x: 0, y: -1}],
    "F": [{x: 0, y: 1}, {x: 1, y: 0}],
    "7": [{x: 0, y: 1}, {x: -1, y: 0}],
    "S": [{x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}],
}

const map_cp = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const map = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const W = map[0].length;
const H = map.length;

let S = map
    .map((l, i) => {return {x: l.indexOf("S"), y: i}})
    .filter(e => e.x != -1)[0];

S.shape = "S";

let i_curr = 0;
let queue = [];

queue.push(S);
map[S.y][S.x] = "X";

while (i_curr < queue.length) {
    S = queue[i_curr++];
    to_map[S.shape].forEach((offset) => {
        const new_coo = {x: S.x + offset.x, y: S.y + offset.y}
        if (new_coo.x < 0 || new_coo.y < 0 || new_coo.x >= W || new_coo.y >= H)
            return;
        new_coo.shape = map[new_coo.y][new_coo.x];
        if (!Object.keys(to_map).includes(new_coo.shape))
            return;
        if (!to_map[new_coo.shape]
            .some(c => new_coo.x + c.x == S.x && new_coo.y + c.y == S.y))
            return;
        queue.push(new_coo)
        map[new_coo.y][new_coo.x] = "X";
    });
}

console.log(map.map(l => l.join("")).join("\n"), "\n\n")


const fmap = map.map((l, i) => {
    let inside = false;
    let is_last_turn_up;
    return l.map((c, j) => {
        if (c == "X") {
            switch (map_cp[i][j]) {
                case "|":
                    inside = !inside;
                    break;
                case "J":
                    if (!is_last_turn_up)
                        inside = !inside;
                    break;
                case "L":
                    is_last_turn_up = true;
                    break;
                case "7":
                    if (is_last_turn_up)
                        inside = !inside;
                    break;
                case "F":
                    is_last_turn_up = false;
                    break;
            }
            return "X";
        }
        if (inside)
            return "I";
        return "."
    });
});

console.log(fmap.map(l => l.join("")).join("\n"))

const res = fmap.reduce((s, c) => s + c.reduce((s, c) => s + (c == "I"), 0), 0);
console.log("res:", res);
