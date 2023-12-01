

def remove_lettres(lines):
    res = []
    for line in lines:
        nl = ""
        for c in line:
            if ord(c) >= ord('0') and ord(c) <= ord('9'):
                nl += c
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


f = open("input-exple", "r")
lines = f.readlines()

print("result exple: " + fct(lines))

f = open("input-star1", "r")
lines = f.readlines()

print("result star1: " + fct(lines))
