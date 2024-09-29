#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Recursive factorial function (inefficient for large n)
unsigned long long factorial(int n) {
    if (n <= 1) return 1;
    else return n * factorial(n - 1);
}

// Inefficient bubble sort on a large array
void bubble_sort(int *arr, int n) {
    int i, j, temp;
    for (i = 0; i < n-1; i++) {
        for (j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap elements
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

// Inefficient perfect number checker
int is_perfect_number(int num) {
    int i, sum = 0;
    for (i = 1; i < num; i++) { // Checks all numbers less than num
        if (num % i == 0) {
            sum += i;
        }
    }
    return sum == num;
}

// GCD calculation using subtraction method (inefficient)
int gcd(int a, int b) {
    while (a != b) {
        if (a > b)
            a = a - b;
        else
            b = b - a;
    }
    return a;
}

// Function to waste time with redundant computations
void redundant_computations() {
    int i;
    double result = 0.0;
    for (i = 0; i < 100000000; i++) {
        result += i * 0.000001;
        result -= i * 0.000001;
    }
    printf("Result of redundant computations: %f\n", result);
}

int main() {
    // Calculate a large factorial number
    int n = 20; // Adjust n for longer computation times
    unsigned long long fact_n = factorial(n);
    printf("Factorial(%d) = %llu\n", n, fact_n);

    // Generate a large array and sort it using bubble sort
    int array_size = 10000; // Adjust size for longer computation times
    int *arr = (int*)malloc(array_size * sizeof(int));
    srand(time(NULL));
    for (int i = 0; i < array_size; i++) {
        arr[i] = rand() % 100000;
    }
    bubble_sort(arr, array_size);
    printf("First element after sorting: %d\n", arr[0]);
    free(arr);

    // Check if a large number is a perfect number
    int num = 33550336; // Known large perfect number
    if (is_perfect_number(num)) {
        printf("%d is a perfect number\n", num);
    } else {
        printf("%d is not a perfect number\n", num);
    }

    // Calculate GCD using inefficient method
    int a = 123456, b = 789012;
    int gcd_result = gcd(a, b);
    printf("GCD(%d, %d) = %d\n", a, b, gcd_result);

    // Perform redundant computations to waste time
    redundant_computations();

    return 0;
