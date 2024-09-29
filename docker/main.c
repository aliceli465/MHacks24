#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define some basic instructions for the VM
enum {
    HALT,    // Stop execution
    PUSH,    // Push a value onto the stack
    POP,     // Pop a value from the stack
    ADD,     // Add two values
    SUB,     // Subtract two values
    MUL,     // Multiply two values
    DIV      // Divide two values
};

// Virtual Machine state
typedef struct {
    int *stack;        // Stack memory
    int sp;            // Stack pointer (top of the stack)
    int ip;            // Instruction pointer
    int running;       // Is the VM running?
} VM;

// Initialize the VM
VM* init_vm(int stack_size) {
    VM* vm = (VM*)malloc(sizeof(VM));
    vm->stack = (int*)malloc(sizeof(int) * stack_size);
    vm->sp = -1;
    vm->ip = 0;
    vm->running = 1;
    return vm;
}

// Free the VM's resources
void free_vm(VM* vm) {
    free(vm->stack);
    free(vm);
}

// Push a value onto the stack
void push(VM *vm, int value) {
    vm->stack[++vm->sp] = value;
}

// Pop a value from the stack
int pop(VM *vm) {
    if (vm->sp == -1) {
        printf("Stack underflow\n");
        exit(1);
    }
    return vm->stack[vm->sp--];
}

// Execute a single instruction
void execute(VM *vm, int *program) {
    switch (program[vm->ip]) {
        case HALT:
            vm->running = 0;
            break;
        case PUSH:
            push(vm, program[++vm->ip]);
            break;
        case POP:
            printf("Popped: %d\n", pop(vm));
            break;
        case ADD: {
            int b = pop(vm);
            int a = pop(vm);
            push(vm, a + b);
            break;
        }
        case SUB: {
            int b = pop(vm);
            int a = pop(vm);
            push(vm, a - b);
            break;
        }
        case MUL: {
            int b = pop(vm);
            int a = pop(vm);
            push(vm, a * b);
            break;
        }
        case DIV: {
            int b = pop(vm);
            if (b == 0) {
                printf("Division by zero\n");
                exit(1);
            }
            int a = pop(vm);
            push(vm, a / b);
            break;
        }
        default:
            printf("Unknown instruction: %d\n", program[vm->ip]);
            exit(1);
    }
    vm->ip++;
}

// Run the program
void run(VM *vm, int *program) {
    while (vm->running) {
        execute(vm, program);
    }
}

int main() {
    // Example program: Push 2 and 3, add them, pop the result
    int program[] = {
        PUSH, 2,
        PUSH, 3,
        ADD,
        POP,
        HALT
    };

    // Initialize the VM with a stack size of 256
    VM *vm = init_vm(256);

    // Run the program
    run(vm, program);

    // Free resources
    free_vm(vm);

    return 0;
}

