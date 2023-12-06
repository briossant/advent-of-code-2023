import sys
import math


def parseNbs(string):
    res = []
    curr_nb = 0
    b = False
    for i in range(len(string)):
        if string[i].isdigit():
            curr_nb *= 10
            curr_nb += int(string[i])
            b = True
        elif b:
            b = False
            res.append(curr_nb)
            curr_nb = 0
    return res


if (len(sys.argv) < 2):
    print("Usage: python", sys.argv[0], "<input file>")
    sys.exit(1)

f = open(sys.argv[1])
lines = f.readlines()

times = parseNbs(lines[0])
dists = parseNbs(lines[1])

total_diff = 1
for i in range(len(times)):
    Ttt = times[i]
    d = dists[i] + 0.00001  # epsilon
    x2 = (Ttt + (Ttt**2 - 4*d)**0.5) / 2
    x1 = (Ttt - (Ttt**2 - 4*d)**0.5) / 2

    diff = math.ceil(x2) - math.ceil(x1)
    total_diff *= diff
    print("x1 :", str(x1), "- x2 :", str(x2), "- diff :", str(diff))

print("total_diff :", str(total_diff))
