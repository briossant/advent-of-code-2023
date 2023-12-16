const fs = require('fs');

Array.prototype.XindexOf = function (label) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].label == label)
            return i;
    }
    return -1;
};


if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}


const hash = (x) => x.split("").reduce((h, c) =>
    ((h + c.charCodeAt(0)) * 17) % 256, 0);



const lines = fs.readFileSync(process.argv[2])
    .toString()
    .replace("\n", "")
    .split(",")
    .map(l => l.includes("=") ?
        {
            is_dash: false,
            label: l.split("=")[0],
            focal_len: parseInt(l.split("=")[1])
        } :
        {
            is_dash: true,
            label: l.split("-")[0]
        }
    ).map(obj => {
        obj.hash = hash(obj.label);
        return obj;
    });

const boxes = [...Array(256)].map(() => []);

lines.forEach(obj => {
    let i = boxes[obj.hash].XindexOf(obj.label);
    if (obj.is_dash) {
        if (i != -1)
            boxes[obj.hash].splice(i, 1);
    } else {
        if (i != -1)
            boxes[obj.hash][i].focal_len = obj.focal_len;
        else
            boxes[obj.hash].push({label: obj.label, focal_len: obj.focal_len});
    }
});


//console.log(boxes);
//console.log(lines);

const res = boxes.reduce((s, b, i) =>
    s + (i + 1) * b
        .reduce((s, obj, i) => s + (i + 1) * obj.focal_len, 0)
    , 0);

console.log("result:", res);

