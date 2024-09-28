#include <stdio.h>

// Inefficient recursive function to calculate factorial
int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int num;

    // Get input from user
    printf("Enter a number: ");
    scanf("%d", &num);

    // Calculate factorial using the inefficient function
    int result = factorial(num);

    // Output the result
    printf("Factorial of %d is %d\n", num, result);

    return 0;
}
