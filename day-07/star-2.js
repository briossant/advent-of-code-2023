const fs = require('fs');

const card_table = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]
const nb_diff_cards = 13


const count_similar = (card_list) => {
    const M = [...Array(nb_diff_cards)].fill(0)
    card_list.forEach(c =>
        M[card_table.indexOf(c)] += 1
    );
    max1 = Math.max(...M.slice(1, nb_diff_cards))
    max1_i = M.slice(1, nb_diff_cards).indexOf(max1) + 1
    if (max1 > 0) {
        max1 += card_list.reduce((s, c) => s + (c == 'J'), 0);
        M[0] = 0
    } else {
        max1 = M[0]
        max1_i = 0
    }

    M[max1_i] = 0
    return [max1, Math.max(...M)]
}

const sortingFct = (card1, card2) => {
    max_c1 = count_similar(card1.split(''))
    max_c2 = count_similar(card2.split(''))

    // brelan / carree / pair
    if (max_c1[0] > max_c2[0])
        return 1;
    if (max_c1[0] < max_c2[0])
        return -1;

    // full house / 2 pair
    if (max_c1[1] > max_c2[1])
        return 1;
    if (max_c1[1] < max_c2[1])
        return -1;

    // similar types
    let p1, p2;
    for (let i = 0; i < 5; ++i) {
        p1 = card_table.indexOf(card1[i])
        p2 = card_table.indexOf(card2[i])
        if (p1 > p2)
            return 1;
        if (p1 < p2)
            return -1;
    }

    return 0;
}

if (process.argv.length < 3) {
    console.log("Usage: ", process.argv[0], process.argv[1], "<input file>")
    process.exit(1)
}

const lines = fs.readFileSync(process.argv[2])
    .toString()
    .split("\n")
    .filter(l => l.length)
    .map(l => l.split(" "));


tt_winnings = lines
    .sort((l1, l2) => sortingFct(l1[0], l2[0]))
    .reduce((sum, l, i) => (i + 1) * parseInt(l[1]) + sum, 0);


console.log("total winnings :", tt_winnings)
