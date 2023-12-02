#include <stdio.h>
#include <err.h>
#include <stdlib.h>

int getLinePower(char *line, char *end_ptr, size_t len) {

    int r = 0;
    int g = 0;
    int b = 0;
    int max_r = 0;
    int max_g = 0;
    int max_b = 0;

    int tmp;
    size_t offset = end_ptr - line;

    while (offset < len - 1) {
        if (line[offset] != ',') {
            if (r > max_r)
                max_r = r;
            if (g > max_g)
                max_g = g;
            if (b > max_b)
                max_b = b;
            r = 0;
            g = 0;
            b = 0;
        }
        offset += 2;
        tmp = strtol(line + offset, &end_ptr, 10);
        offset = end_ptr - line + 1;
        switch (line[offset]) {
        case 'r':
            r += tmp;
            offset += 3;
            break;
        case 'g':
            g += tmp;
            offset += 5;
            break;
        case 'b':
            b += tmp;
            offset += 4;
            break;
        default:
            errx(1, "wrong char ?? %s", line + offset);
        }
    }
    if (r > max_r)
        max_r = r;
    if (g > max_g)
        max_g = g;
    if (b > max_b)
        max_b = b;

    return max_b * max_g * max_r;
}

int main(int argc, char **argv) {
    printf("~~ Star 1 ~~\n");
    if (argc < 2) {
        printf("Usage: ./star-1 <input filename>\n");
        return 1;
    }

    FILE *f = fopen(argv[1], "r");
    char *line = NULL;
    ssize_t len;
    size_t size;

    char *end_ptr;

    int total_power = 0;

    while ((len = getline(&line, &size, f)) != -1) {
        strtol(line + 5, &end_ptr, 10);
        total_power += getLinePower(line, end_ptr, len);
    }

    printf("Total required power: %d\n", total_power);

    return 0;
}
