const fs = require('fs');

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
};
Array.prototype.getEnergy = function () {
    return this.reduce((s, c) =>
        s + c.reduce((s, c) => s + (c == "#"), 0)
        , 0);
};

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}


const map = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(""));

const energy_map = map
    .map(l => l
        .map(() => ".")
    );

const path_map = map
    .map(l => l
        .map(() => 0)
    );

const W = map[0].length;
const H = map.length;

class Point {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    parseDir() {
        return this.dx + this.dy * 2;
    }

    turn(clockwise = true) {
        if (clockwise) {
            const tmp = this.dx;
            this.dx = -this.dy;
            this.dy = -tmp;
        } else {
            const tmp = this.dx;
            this.dx = this.dy;
            this.dy = tmp;
        }
    }

    // return true is out of bounds
    move() {
        this.x += this.dx;
        this.y += this.dy;
        //check for path map
        if (this.x < 0 || this.y < 0 || this.x >= W || this.y >= H)
            return true

        if (path_map[this.y][this.x] == this.parseDir())
            return true;
        path_map[this.y][this.x] = this.parseDir();

        return false;
    }

    isSpliting(c) {
        if (this.dx == 0)
            return c == "-"
        return c == "|"
    }
}

const points = [];

const PropagatePoint = (p) => {
    switch (map[p.y][p.x]) {
        case "\\":
            p.turn(false);
            break;
        case "/":
            p.turn(true);
            break;
        case "|": case "-":
            if (p.isSpliting(map[p.y][p.x])) {
                const np = new Point(p.x, p.y, p.dx, p.dy);
                np.turn(true);
                p.turn(false);
                if (!np.move())
                    points.push(np);
            }
            break;
    }

    energy_map[p.y][p.x] = "#";

    if (!p.move())
        PropagatePoint(p);
}

const resetMaps = () => {
    for (let i = 0; i < H; ++i) {
        energy_map[i] = energy_map[i].map(() => ".");
        path_map[i] = path_map[i].map(() => 0);
    }
}

const propagate = (max_energy) => {
    while (points.length > 0) {
        PropagatePoint(points[0]);
        points.shift();
    }
    console.log(energy_map.prettyForPrint(), "\n\n")
    max_energy = Math.max(max_energy, energy_map.getEnergy());
    resetMaps();
    return max_energy;
}

// reset energy_map & path_map
// add new starting point

let max_energy = 0;
for (let x = 0; x < W; ++x) {
    points.push(new Point(x, 0, 0, 1));
    max_energy = propagate(max_energy);

    points.push(new Point(x, H - 1, 0, -1));
    max_energy = propagate(max_energy);
}

for (let y = 0; y < H; ++y) {
    points.push(new Point(0, y, 1, 0));
    max_energy = propagate(max_energy);

    points.push(new Point(W - 1, y, -1, 0));
    max_energy = propagate(max_energy);
}

console.log("result:", max_energy);

