#include <stdio.h>
#include <err.h>
#include <stdlib.h>

int isLineValid(char *line, char *end_ptr, size_t len) {

    int r = 0;
    int g = 0;
    int b = 0;
    int tmp;
    size_t offset = end_ptr - line;

    while (offset < len - 1) {
        if (line[offset] != ',') {
            if (r > 12 || g > 13 || b > 14) {
                return 0;
            }
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
    if (r > 12 || g > 13 || b > 14) {
        return 0;
    }

    return 42;
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

    int game_id;
    char *end_ptr;

    int ids_sum = 0;

    while ((len = getline(&line, &size, f)) != -1) {
        game_id = strtol(line + 5, &end_ptr, 10);
        if (isLineValid(line, end_ptr, len))
            ids_sum += game_id;
    }

    printf("sum of possible game IDs: %d\n", ids_sum);

    return 0;
}
