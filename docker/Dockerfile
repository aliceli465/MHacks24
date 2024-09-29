# Base image: use a lightweight image that has GCC and other build essentials
FROM gcc:latest

# Install Valgrind
RUN apt-get update && apt-get install -y valgrind

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy the script that will compile and run valgrind
COPY run_valgrind.sh .

# Give execute permission to the script
RUN chmod +x run_valgrind.sh

# Define default command that runs the script
CMD ["./run_valgrind.sh"]

