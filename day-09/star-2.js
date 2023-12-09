const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l
        .split(" ")
        .map(e => parseInt(e))
    );

const diff = lines.map(line => {
    const nline = [];
    let b = true;
    while (b) {
        b = false;
        nline.push(line[0]);
        for (let i = 0; i < line.length - 1; i++) {
            line[i] = line[i + 1] - line[i];
            if (line[i] != 0)
                b = true
        }
        line.pop();
    }
    return nline.reverse().reduce((s, c) => c - s, 0);
});


console.log(diff.reduce((s, c) => s + c, 0));

