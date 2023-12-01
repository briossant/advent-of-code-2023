

other_format = ["one", "two", "three", "four",
                "five", "six", "seven", "eight", "nine"]


def remove_lettres(lines):
    res = []
    for l in lines:
        nl = ""
        for i in range(len(l)):
            if ord(l[i]) >= ord('0') and ord(l[i]) <= ord('9'):
                nl += l[i]
            else:
                for j in range(len(other_format)):
                    if l[i:i+len(other_format[j])] == other_format[j]:
                        nl += str(j+1)
        res.append(nl)
    return res


def fct(lines):
    nl = remove_lettres(lines)
    sm = 0
    for l in nl:
        if len(l) == 0:
            continue
        c1 = ord(l[0]) - ord('0')
        c2 = ord(l[len(l) - 1]) - ord('0')
        sm += c1*10 + c2
    return str(sm)


f = open("input-exple2", "r")
lines = f.readlines()

print("result exple: " + fct(lines))

f = open("input-star1", "r")
lines = f.readlines()

print("result star1: " + fct(lines))
