const fs = require('fs');
const {lcm} = require('mathjs')

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
const steps = mapKeys.map(() => 0);

for (let i = 0; i < mapKeys.length; ++i) {
    let dir_i = 0;
    while (mapKeys[i][2] != "Z") {
        mapKeys[i] = map[mapKeys[i]][directions[dir_i]]
        steps[i]++;
        dir_i = ++dir_i % directions.length
    }
}

console.log("find the PPCM of: ", steps);
console.log("result:", steps.reduce((s, c) => lcm(s, c), 1));
