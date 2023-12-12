const fs = require('fs');

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const rmSpring = (springs) => [springs[0].slice(1), ...springs.slice(1)];

const decLength = (lengths) => [lengths[0] - 1, ...lengths.slice(1)];

const nbrOfArrangements = (springs, lengths, isRemoving = false) => {
    if (springs.length == 0)
        return lengths.length == 0;
    if (lengths.length == 0)
        return springs.every(sp => !sp.some(c => c == "#"));


    if (springs[0].length == 0) {
        if (lengths[0] > 0) {
            if (isRemoving)
                return 0;
            return nbrOfArrangements(springs.slice(1), lengths, false);
        }
        return nbrOfArrangements(springs.slice(1), lengths.slice(1), false);
    }

    if (springs[0][0] == "#") {
        if (lengths[0] == 0)
            return 0
        return nbrOfArrangements(rmSpring(springs), decLength(lengths), true);
    }

    if (lengths[0] == 0)
        return nbrOfArrangements(rmSpring(springs), lengths.slice(1), false);

    if (isRemoving)
        return nbrOfArrangements(rmSpring(springs), decLength(lengths), true);

    return nbrOfArrangements(rmSpring(springs), decLength(lengths), true)
        + nbrOfArrangements(rmSpring(springs), lengths, false);
}


const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(" "));

const springs_groups = lines
    .map(l => l[0]
        .split(".")
        .filter(g => g.length)
        .map(g => g.split(""))
    );

const groups_len = lines
    .map(l => l[1]
        .split(",")
        .map(len => parseInt(len))
    );

//console.log(springs_groups)
//console.log(groups_len)

res = 0
for (let i = 0; i < springs_groups.length; ++i)
    (res += nbrOfArrangements(springs_groups[i], groups_len[i]))

console.log(res)

