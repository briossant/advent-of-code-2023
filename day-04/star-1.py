import sys


def parseNbs(string):
    res = []
    curr_nb = 0
    for i in range(len(string)):
        if string[i].isdigit():
            curr_nb *= 10
            curr_nb += int(string[i])
        elif curr_nb > 0:
            res.append(curr_nb)
            curr_nb = 0
    return res


if (len(sys.argv) < 2):
    print("Usage: python", sys.argv[0], "<input file>")
    sys.exit(1)

f = open(sys.argv[1])
lines = f.readlines()

lines = [l.split(':')[1].split('|') for l in lines]

winning_nbs = [parseNbs(l[0]) for l in lines]
my_nbs = [parseNbs(l[1]) for l in lines]

res = 0
for i in range(len(winning_nbs)):
    points = 0
    for nb in winning_nbs[i]:
        if nb in my_nbs[i]:
            points *= 2
            if points == 0:
                points = 1
    res += points

print("Total points:", str(res))
