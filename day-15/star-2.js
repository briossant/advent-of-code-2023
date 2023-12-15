const fs = require('fs');

Array.prototype.trans = function () {
    return this[0].map((_, i) => this.map(x => x[i]));
};

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
};

Array.prototype.sum = function () {
    return this.reduce((s, c) => s + c, 0);
};

// only if same size
Array.prototype.isTheSame = function (arr2) {
    return this.every((x, i) => x.every((y, j) => y == arr2[i][j]));
}

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

// will modify line /!\
const roll = (line, rev) => {
    let len = line.length;
    let dir = 1;
    let last_good_place = 0;
    if (rev) {
        last_good_place = len - 1;
        dir = -1;
        len = -1;
    }
    for (let i = last_good_place; i != len; i += dir) {
        if (line[i] == "#") {
            last_good_place = i + dir;
        } else if (line[i] == "O") {
            line[i] = ".";
            line[last_good_place] = "O";
            last_good_place += dir;
        }
    }
    return line;
}

const countRocks = (lines) => {
    const len = lines[0].length;
    return lines
        .trans()
        .map((l) => l
            .reduce((s, r, i) => s + (r == "O" ? len - i : 0), 0)
        )
        .sum();
}

const rollAll = (lines, rev = false) => lines.trans().map(line => roll(line, rev));

// don't modify lines
const cycle = (lines, nbr) => {
    let i = 0;
    while (i++ < nbr) {

        // N
        lines = rollAll(lines);

        // W
        lines = rollAll(lines);

        // S
        lines = rollAll(lines, true);

        // E
        lines = rollAll(lines, true);
    }

    return lines;
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l
        .split("")
    );


// seems to enter a loop after a bit of time
// idea: run for like a 1000 cycle and then search for the loop
const first_run_len = 1042;
const total_runs = 1000000000;
const memory = [cycle(lines, first_run_len)];

memory.push(cycle(memory[memory.length - 1], 1));

while (!memory[0].isTheSame(memory[memory.length - 1]))
    memory.push(cycle(memory[memory.length - 1], 1));

const loop_size = memory.length - 1;
console.log("loop size: ", loop_size);

const memory_rocks = memory.map(m => countRocks(m));
console.log("memory rocks:", memory_rocks);

const loop_index = (total_runs - first_run_len) % loop_size;
console.log("loop index: ", loop_index);

console.log("result:", countRocks(memory[loop_index]));

