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
n = len(lines)

winning_nbs = [parseNbs(l[0]) for l in lines]
my_nbs = [parseNbs(l[1]) for l in lines]
calls = [1] * n

for i in range(n):
    matches = 0
    for nb in winning_nbs[i]:
        if nb in my_nbs[i]:
            matches += 1
    for j in range(1, matches + 1):
        calls[i+j] += calls[i]

res = sum(calls)
print("Number of cards:", str(res))
