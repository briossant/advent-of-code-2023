const fs = require('fs');

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
};

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const dirs = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1},
];

const heat_map = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l
        .split("")
        .map(x => parseInt(x))
    );

heat_map[0][0] = 0;

const W = heat_map[0].length;
const H = heat_map.length;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.heat = 0;
        this.last_dir = -1;
        this.dir_count = 0;
        this.copyMap(heat_map);
    }

    copyMap(map) {
        this.heat_map = map
            .map(l => l.map(x => x));
    }

    copy() {
        const p = new Point(this.x, this.y);
        p.heat = this.heat;
        p.last_dir = this.last_dir;
        p.dir_count = this.dir_count;
        p.copyMap(this.heat_map);
        return p;
    }

    // return true if not valid
    move(dir) {
        //check dir count
        if (dir == this.last_dir) {
            this.dir_count++;
            if (this.dir_count > 3)
                return true;
        } else {
            this.last_dir = dir;
            this.dir_count = 1;
        }

        // move
        this.x += dirs[dir].x;
        this.y += dirs[dir].y;

        // check bounds
        if (this.x < 0 || this.y < 0 || this.x >= W || this.y >= H)
            return true

        // check heat_map
        if (this.heat_map[this.y][this.x] == 0)
            return true;

        // update heat
        this.heat += this.heat_map[this.y][this.x];
        this.heat_map[this.y][this.x] = 0;

        //console.log(this.heat_map.prettyForPrint(), this.x, this.y, this.heat, "\n");

        return false;
    }
}

let min_heat = Infinity;
const to_propagate = [new Point(0, 0)];
const propagate = (p) => {
    if (p.heat >= min_heat - (H - p.x - 1) - (W - p.y - 1))
        return //console.log(p.heat_map.prettyForPrint(), "\n\n");
    if (p.x == H - 1 && p.y == W - 1)
        return console.log(min_heat = p.heat);

    let to_prop = undefined;
    for (let d = 0; d < dirs.length; ++d) {
        const np = p.copy();
        if (!np.move(d)) {
            if (to_prop == undefined)
                to_prop = np;
            else
                to_propagate.push(np);
        }
    }
    if (to_prop != undefined)
        propagate(to_prop);
}

let i = 0;
while (to_propagate.length > i) {
    propagate(to_propagate[i++]);
    console.log(min_heat)
}
console.log("result:", min_heat);
