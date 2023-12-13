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

const proj_dir = {
    "J": {x: -1, y: -1},
    "L": {x: 1, y: -1},
    "F": {x: 1, y: 1},
    "7": {x: -1, y: 1},
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const map = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const W = lines[0].length;
const H = lines.length;

const project = (coo) => {
    if (coo.shape == "|") {
        let x = coo.x + proj_dir[coo.p_dir].x;
        while (x >= 0 && x < W && map[coo.y][x] != "X")
            x += proj_dir[coo.p_dir].x;
        if (x < 0 || x >= W)
            return;
        for (let i = Math.min(x, coo.x) + 1; i < Math.max(x, coo.x); i++)
            map[coo.y][i] = "I";
    } else {
        let y = coo.y + proj_dir[coo.p_dir].y;
        while (y >= 0 && y < H && map[y][coo.x] != "X")
            y += proj_dir[coo.p_dir].y;
        if (y < 0 || y >= H)
            return;
        for (let i = Math.min(y, coo.y) + 1; i < Math.max(y, coo.y); i++)
            map[i][coo.x] = "I";
    }
}

const St = lines
    .map((l, i) => {return {x: l.indexOf("S"), y: i}})
    .filter(e => e.x != -1)[0];

St.shape = process.argv[3];
St.p_dir = St.shape;

let i_curr = 0;

let queue = [];

queue.push(St);
map[St.y][St.x] = "X";

while (i_curr < queue.length) {
    const S = queue[i_curr++];
    to_map[S.shape].forEach((offset) => {
        const new_coo = {x: S.x + offset.x, y: S.y + offset.y}
        new_coo.shape = map[new_coo.y][new_coo.x];
        if (!Object.keys(to_map).includes(new_coo.shape))
            return;
        queue.push(new_coo)
        map[new_coo.y][new_coo.x] = "X";
    });
}

console.log(map.map(l => l.join("")).join("\n"))

i_curr = 0;
queue = [];

queue.push(St);
lines[St.y][St.x] = "X";

while (i_curr < queue.length) {
    const S = queue[i_curr++];
    to_map[S.shape].forEach((offset) => {
        const new_coo = {x: S.x + offset.x, y: S.y + offset.y}
        new_coo.shape = lines[new_coo.y][new_coo.x];
        if (!Object.keys(to_map).includes(new_coo.shape))
            return;
        if (Object.keys(proj_dir).includes(new_coo.shape))
            new_coo.p_dir = new_coo.shape;
        else {
            new_coo.p_dir = S.p_dir;
            project(new_coo);
        }
        queue.push(new_coo)
        lines[new_coo.y][new_coo.x] = "X";
    });
}

console.log(map.map(l => l.join("")).join("\n"))
