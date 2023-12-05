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
            if seed_ed > ranges[1] and seed_st < ranges[1] + ranges[2]:
                new_seeds.append()  # add new seed st
                new_seeds.append()  # add new seed len
                # if new ed < seed_ed add to new seed to seeds
                # update seed ed
                # if seed_ed == seed_st return
        #if seed_ed > seed_st add seed_st
    seeds = new_seeds



print("min is :",str(min(seeds)))
