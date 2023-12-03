import sys


if (len(sys.argv) < 2):
    print("Usage: python", sys.argv[0], "<input file>")
    sys.exit(1)

f = open(sys.argv[1])
lines = f.readlines()

coo = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, -1),
       (1, -1), (-1, 1)]
parts_coo = []


def rm(l, y, x):
    if (y, x) in l:
        if (y, x+1) in l:
            l.remove((y, x+1))
        if (y, x-1) in l:
            l.remove((y, x-1))


for y in range(len(lines)):
    for x in range(len(lines[y])):
        if lines[y][x] != '*':
            continue
        nums = []
        for (dy, dx) in coo:
            try:
                if lines[y+dy][x+dx].isdigit():
                    nums.append((y+dy, x+dx))
            except:
                continue
        rm(nums, y+1, x)
        rm(nums, y-1, x)
        if len(nums) == 2:
            parts_coo.append(nums)


def parseNb(y, x):
    x1, x2 = x, x
    while x1 > 0 and lines[y][x1-1].isdigit():
        x1 -= 1
    while x2 < len(lines[y]) - 1 and lines[y][x2+1].isdigit():
        x2 += 1
    return int(lines[y][x1: x2+1])


res = 0
for e in parts_coo:
    res += parseNb(e[0][0], e[0][1]) * parseNb(e[1][0], e[1][1])

print("Result:", str(res))
