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
    for si in range(0,len(seeds),2):
        seed_st = seeds[si]
        seed_ed = seeds[si] + seeds[si+1]
        for ranges in conv_table:
            range_st = ranges[1]
            range_new_st = ranges[0]
            range_ed = ranges[1] + ranges[2]
            if seed_ed > range_st and seed_st < range_ed:
                new_seeds.append(range_new_st + max(seed_st, range_st) - range_st)  # add new seed st
                new_seeds.append(min(range_ed, seed_ed) - max(seed_st, range_st))  # add new seed len
                if range_ed < seed_ed: 
                    seeds.append(range_ed)
                    seeds.append(seed_ed-range_ed)
                seed_ed = max(seed_st, range_st)
                if seed_ed == seed_st:
                    break
        if seed_ed > seed_st:
            new_seeds.append(seed_st)
            new_seeds.append(seed_ed-seed_st)
    seeds = new_seeds


min_seeds = [seeds[i] for i in range(0,len(seeds),2)]
print("min is :",str(min(min_seeds)))
