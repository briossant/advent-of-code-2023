const fs = require('fs');

Array.prototype.prettyForPrint = function () {
    return this.map(x => x.join("")).join("\n");
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

const points = [new Point(0, 0, 1, 0)];

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


while (points.length > 0) {
    PropagatePoint(points[0]);
    console.log(energy_map.prettyForPrint(), "\n\n")
    points.shift();
}

const res = energy_map.reduce((s, c) =>
    s + c.reduce((s, c) => s + (c == "#"), 0)
    , 0);

console.log("result:", res);

