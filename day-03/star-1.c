#include <stdio.h>
#include <err.h>
#include <stdlib.h>

typedef struct list {
    int val;
    ssize_t len;
    ssize_t index;
    struct list *next;
} list;

void print_list(list *list) {
    while (list != NULL) {
        printf("v:%d i:%ld l:%ld -> ", list->val, list->index, list->len);
        list = list->next;
    }
    printf("\n");
}

int ReturnAndReset(list *part) {
    int val = part->val;
    printf("|||||||||||||adding %d %ld %ld\n", val, part->index, part->len);
    part->val = 0;
    return val;
}

int CheckFromPart(list *last_symbols, list *previous_symbol, list *part) {
    if (previous_symbol->val > 0 && part->index == previous_symbol->index + 1)
        return ReturnAndReset(part);
    while ((last_symbols = last_symbols->next) != NULL) {
        if (last_symbols->index >= part->index - 1) {
            if (last_symbols->index <= part->index + part->len)
                return ReturnAndReset(part);
            return 0;
        }
    }
    return 0;
}

int CheckFromSymbol(list *last_parts_num, list *previous_part, list *symbol) {
    int sum = 0; // symbols can affect multiple parts grrrrrr
    if (previous_part->val > 0 &&
        symbol->index == previous_part->index + previous_part->len)
        sum += ReturnAndReset(previous_part);
    while ((last_parts_num = last_parts_num->next) != NULL) {
        if (symbol->index <= last_parts_num->index + last_parts_num->len &&
            symbol->index >= last_parts_num->index - 1)
            sum += ReturnAndReset(last_parts_num);
    }
    return sum;
}

int ParseLine(list *last_parts_num, list *last_symbols, char *line,
              size_t len) {
    char *end_ptr;
    list *new_parts_num = calloc(1, sizeof(list));
    list *new_symbols = calloc(1, sizeof(list));

    int parts_sum = 0;

    size_t i = 0;
    list *ptr_parts = new_parts_num;
    list *ptr_symbols = new_symbols;

    while (i < len - 1) {
        if (line[i] == '.')
            ++i;
        else if (line[i] >= '0' && line[i] <= '9') {
            int part_num = strtol(line + i, &end_ptr, 10);
            ptr_parts->next = malloc(sizeof(list));
            ptr_parts = ptr_parts->next;
            ptr_parts->val = part_num;
            ptr_parts->len = end_ptr - line - i;
            ptr_parts->index = i;
            i = end_ptr - line;

            parts_sum += CheckFromPart(last_symbols, ptr_symbols, ptr_parts);
        } else {
            ptr_symbols->next = malloc(sizeof(list));
            ptr_symbols = ptr_symbols->next;
            ptr_symbols->val = 42;
            ptr_symbols->index = i;
            ++i;

            parts_sum +=
                CheckFromSymbol(last_parts_num, ptr_parts, ptr_symbols);
        }
    }

    // I know it leaks but I'm lazy
    last_parts_num->next = new_parts_num->next;
    last_symbols->next = new_symbols->next;
    return parts_sum;
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

    int parts_sum = 0;
    list *last_parts_num = calloc(1, sizeof(list));
    list *last_symbols = calloc(1, sizeof(list));

    while ((len = getline(&line, &size, f)) != -1) {
        parts_sum += ParseLine(last_parts_num, last_symbols, line, len);
    }

    printf("sum parts number: %d\n", parts_sum);

    return 0;
}
