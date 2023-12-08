const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length);

const directions = lines[0]
    .split("")
    .map(e => 0 + (e == "R")); // 1 for right , 0 for left

const map = {}
const mapKeys = []

lines
    .slice(1)
    .map(l => l.split(" = "))
    .forEach(l => {
        map[l[0]] = l[1]
            .slice(1, -1) //remove parenthesis
            .split(", ");
        if (l[0][2] == "A")
            mapKeys.push(l[0])
    });

console.log(mapKeys)
let dir_i = 0;
let keysWithZ = 0;
let steps = 0;

while (keysWithZ != mapKeys.length) {
    keysWithZ = 0
    for (let i = 0; i < mapKeys.length; ++i) {
        mapKeys[i] = map[mapKeys[i]][directions[dir_i]]
        if (mapKeys[i][2] == "Z")
            ++keysWithZ;
    }
    steps++;
    dir_i = ++dir_i % directions.length
}

console.log("number of steps to find ZZZ: ", steps)

