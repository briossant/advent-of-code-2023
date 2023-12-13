const fs = require('fs');

if (process.argv.length < 5) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file> <Starting shape> <st proj_dir>")
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
    "N": -1,
    "S": 1,
    "E": 1,
    "W": -1,
}

const trans_proj_dir = {
    "J": {"N": "W", "E": "S", "W": "N", "S": "E"},
    "F": {"N": "W", "E": "S", "W": "N", "S": "E"},
    "7": {"N": "E", "W": "S", "S": "W", "E": "N"},
    "L": {"N": "E", "W": "S", "S": "W", "E": "N"},
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
    console.log(coo)
    let fill = "I"
    if (coo.p_dir == "N" || coo.p_dir == "S") {
        let x = coo.x + proj_dir[coo.p_dir];
        while (x >= 0 && x < W && map[coo.y][x] != "X")
            x += proj_dir[coo.p_dir];
        if (x < 0 || x >= W)
            fill = "O"
        for (let i = Math.min(x, coo.x) + 1; i < Math.max(x, coo.x); i++)
            map[coo.y][i] = fill;
    } else {
        let y = coo.y + proj_dir[coo.p_dir];
        while (y >= 0 && y < H && map[y][coo.x] != "X")
            y += proj_dir[coo.p_dir];
        if (y < 0 || y >= H)
            fill = "O"
        for (let i = Math.min(y, coo.y) + 1; i < Math.max(y, coo.y); i++)
            map[i][coo.x] = fill;
    }
}

const St = lines
    .map((l, i) => {return {x: l.indexOf("S"), y: i}})
    .filter(e => e.x != -1)[0];

St.shape = process.argv[3];
St.p_dir = process.argv[4];

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
        if (!to_map[new_coo.shape]
            .some(c => new_coo.x + c.x == S.x && new_coo.y + c.y == S.y))
            return;
        queue.push(new_coo)
        map[new_coo.y][new_coo.x] = "X";
    });
}

console.log(map.map(l => l.join("")).join("\n"))

queue.push(St);
lines[St.y][St.x] = "X";

let S = St;
let c = true;
while (c) {
    c = false;
    to_map[S.shape].forEach((offset) => {
        if (c)
            return;
        const new_coo = {x: S.x + offset.x, y: S.y + offset.y}
        new_coo.shape = lines[new_coo.y][new_coo.x];
        new_coo.p_dir = S.p_dir;
        if (!Object.keys(to_map).includes(new_coo.shape))
            return;
        if (!to_map[new_coo.shape]
            .some(c => new_coo.x + c.x == S.x && new_coo.y + c.y == S.y))
            return;
        if (Object.keys(trans_proj_dir).includes(new_coo.shape)) {
            project(new_coo);
            new_coo.p_dir = trans_proj_dir[new_coo.shape][S.p_dir];
        }
        project(new_coo);
        S = (new_coo)
        c = true
        lines[S.y][S.x] = "X";
    });
}

console.log(map.map(l => l.join("")).join("\n"))
console.log("res:", map.reduce((s, c) => s + c.reduce((s, c) => s + (c == "I"), 0), 0))
