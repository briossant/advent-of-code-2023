const fs = require('fs');

Array.prototype.trans = function () {
    return this[0].map((_, i) => this.map(x => x[i]));
};


if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const checkIfMirror = (l, center) => {
    for (let i = center - 1, j = center; i >= 0 && j < l.length; --i, ++j) {
        if (l[i] !== l[j])
            return false;
    }
    return true;
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n\n")
    .filter(l => l.length)
    .map(l => l
        .split("\n")
        .filter(l => l.length)
    );


//console.log(lines)

let res = 0;
lines.forEach(l => {
    for (let i = 1; i < l.length; ++i)
        if (checkIfMirror(l, i))
            return res += 100 * i;

    const lt = l
        .map(s => s.split(""))
        .trans()
        .map(s => s.join(""));

    for (let i = 1; i < lt.length; ++i)
        if (checkIfMirror(lt, i))
            return res += i;
});


console.log("result :", res);
