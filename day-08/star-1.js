const fs = require('fs');

const map = {}


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

lines
    .slice(1)
    .map(l => l.split(" = "))
    .forEach(l => {
        map[l[0]] = l[1]
            .slice(1, -1) //remove parenthesis
            .split(", ");
    });


let dir_i = 0;
let map_key = "AAA";
let steps = 0;

while (map_key != "ZZZ") {
    map_key = map[map_key][directions[dir_i]]
    steps++;
    dir_i = ++dir_i % directions.length
}

console.log("number of steps to find ZZZ: ", steps)

