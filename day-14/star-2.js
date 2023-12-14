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
        .map((l) => l
            .reduce((s, r, i) => s + (r == "O" ? len - i : 0), 0)
        )
        .sum();
}

//will modify lines
const rollAll = (lines, rev = false) => lines.trans().map(line => roll(line, rev));

const cycle = (lines) => {
    let i = 0;
    while (i++ < 1000000000) {
        console.log(lines.prettyForPrint(), "\n\n")

        // N
        let nl = rollAll(lines);

        // W
        nl = rollAll(nl);

        // S
        nl = rollAll(nl, true);

        // E
        nl = rollAll(nl, true);

        if (nl.isTheSame(lines)) {
            console.log("result:", countRocks(lines));
            return;
        }
        lines = nl;
    }

    console.log("result:", countRocks(lines));
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
cycle(lines);


