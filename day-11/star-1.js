const fs = require('fs');

Array.prototype.trans = function () {
    return this[0].map((_, i) => this.map(x => x[i]));
};

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
};

Array.prototype.insert = function (index, ...items) {
    this.splice(index, 0, ...items);
};

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const expandMap = (map) => {
    const whereToInsert = [];
    map.forEach((l, i) => {
        if (l.every(x => x == '.'))
            whereToInsert.push(i);
    });
    whereToInsert.reverse().forEach(x =>
        map.insert(x, [...Array(map[0].length)].fill("."))
    );
}

let lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

expandMap(lines)
lines = lines.trans();
expandMap(lines)
lines = lines.trans()

console.log(lines.prettyForPrint())

const coo = [];
lines.forEach((l, y) =>
    l.forEach((e, x) => {
        if (e == "#")
            coo.push({x: x, y: y});
    })
);



let dist_sum = 0;
for (let i = 0; i < coo.length; i++)
    for (let j = i + 1; j < coo.length; j++)
        dist_sum += Math.abs(coo[j].x - coo[i].x) + coo[j].y - coo[i].y;


console.log("total dist:", dist_sum);

