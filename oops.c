#include <stdio.h>

// Recursive Fibonacci function (inefficient for large n)
int fibonacci(int n) {
    if (n <= 1) return n;
    else return fibonacci(n - 1) + fibonacci(n - 2);
}

// Inefficient prime checking function
int is_prime(int n) {
    if (n <= 1) return 0;
    int i;
    for (i = 2; i < n; i++) { // Checks all numbers up to n-1
        if (n % i == 0) return 0;
    }
    return 1;
}

// Slow multiplication via repeated addition
int slow_multiply(int a, int b) {
    int result = 0, i;
    for (i = 0; i < b; i++) {
        result += a;
    }
    return result;
}

// Function to waste time with nested loops
void waste_time() {
    int i, j;
    long sum = 0;
    for (i = 0; i < 10000; i++) {
        for (j = 0; j < 10000; j++) {
            sum += i * j;
        }
    }
    printf("Sum in waste_time: %ld\n", sum);
}

int main() {
    // Calculate a large Fibonacci number
    int n = 40; // Adjust n for longer computation times
    int fib_n = fibonacci(n);
    printf("Fibonacci(%d) = %d\n", n, fib_n);

    // Check if a large number is prime
    int num = 10000019;
    if (is_prime(num)) {
        printf("%d is prime\n", num);
    } else {
        printf("%d is not prime\n", num);
    }

    // Perform slow multiplication
    int result = slow_multiply(12345, 6789);
    printf("Result of slow multiplication: %d\n", result);

    // Waste time with nested loops
    waste_time();

    return 0;
}