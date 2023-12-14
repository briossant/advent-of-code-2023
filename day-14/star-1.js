const fs = require('fs');

Array.prototype.trans = function () {
    return this[0].map((_, i) => this.map(x => x[i]));
};

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
};


if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

// will modify line /!\
const roll = (line) => {
    const len = line.length;
    let last_good_place = 0;
    let weight = 0;
    for (let i = 0; i < len; ++i) {
        if (line[i] == "#") {
            //weight += len - i; only rounded rock :)
            last_good_place = i + 1;
        } else if (line[i] == "O") {
            weight += len - last_good_place;
            line[i] = ".";
            line[last_good_place] = "O";
            last_good_place++;
        }
    }
    return weight;
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l
        .split("")
    ).trans();


console.log(lines.trans().prettyForPrint(), "\n\n")


const weights = lines.map(line => roll(line));

console.log(lines.trans().prettyForPrint())

const res = weights.reduce((s, c) => s + c, 0);
console.log("result :", res);
