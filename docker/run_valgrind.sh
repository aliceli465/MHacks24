#!/bin/sh

# Check if the file to compile was passed as an argument
if [ -z "$1" ]; then
  echo "No file specified. Usage: ./run_valgrind.sh <source_file.c>"
  exit 1
fi

# Compile the C/C++ file
gcc -g -o program "$1"

# Check if compilation was successful
if [ $? -ne 0 ]; then
  echo "Compilation failed."
  exit 1
fi

# Run Valgrind on the compiled program
valgrind --tool=memcheck --leak-check=full --log-file=memcheck.log ./program
valgrind --tool=callgrind --callgrind-out-file=callgrind_file ./program
callgrind_annotate --inclusive=no --auto=yes callgrind_file > cgf
rm program
rm callgrind_file

