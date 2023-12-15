const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}


const hash = (x) => x.reduce((h, c) =>
    ((h + c.charCodeAt(0)) * 17) % 256, 0);



const lines = fs.readFileSync(process.argv[2])
    .toString()
    .replace("\n", "")
    .split(",")
    .map(l => l.split(""));


const hashes = lines.map(l => hash(l));
const res = hashes.reduce((a, b) => a + b, 0);

console.log("result:", res);

