import sys


def parseNbs(string):
    res = []
    curr_nb = 0
    b=False
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

def parseAlmanac(lines):
    almanac = [[]]
    i,j = 3,0
    while i<len(lines):
        if len(lines[i]) <= 1:
            i += 2
            j += 1
            almanac.append([])
        else:
            almanac[j].append(parseNbs(lines[i]))
            i+=1
    return almanac
            


if (len(sys.argv) < 2):
    print("Usage: python", sys.argv[0], "<input file>")
    sys.exit(1)

f = open(sys.argv[1])
lines = f.readlines()

seeds = parseNbs(lines[0].split(":")[1])

almanac = parseAlmanac(lines)

for conv_table in almanac:
    new_seeds = []
    for seed in seeds:
        new_seeds.append(-1)
        for ranges in conv_table:
            if seed >= ranges[1] and seed < ranges[1] + ranges[2]:
                new_seeds[-1] = (ranges[0] + seed - ranges[1])
                break
        if new_seeds[-1] == -1:
            new_seeds[-1] = seed
    seeds = new_seeds



print("min is :",str(min(seeds)))
