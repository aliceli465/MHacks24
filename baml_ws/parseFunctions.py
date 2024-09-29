from baml_client.sync_client import b
from baml_client.types import Functions
from typing import List, Dict, Any, Optional
import json


def parseFunctions(raw_resume: str) -> Functions:
    # BAML's internal parser guarantees ExtractResume
    # to be always return a Resume type
    response = b.ExtractFunctions(raw_resume)
    print("DEPENDENCY TREE:")
    dep_tree = dependency_tree(response)
    print("END DEPENDENCY TREE")
    return response.dict(), dep_tree
    


def example(raw_resume: str) -> Functions:
    print("------------------------")
    print("inside parse functions")
    stream = b.stream.ExtractFunctions(raw_resume)
    # for msg in stream:
    #     print(msg)  # This will be a PartialResume type
    # This will be a Resume type
    final = stream.get_final_response()
    return final


def preprocess_functions(functions: Functions) -> Dict[str, List[str]]:
    function_map = {}
    for function in functions.all_functions:
        # Extract the function name and arguments from the func_signature
        func_name_and_args = function.func_signature.split('(')
        if len(func_name_and_args) > 1:
            func_name = func_name_and_args[0].strip().split()[-1].lstrip('*')  # Get the name (last part before args)
            function_map[func_name] = []
            # Add the subcalls if present
            subcall_set = set()
            for subcall in function.func_subcalls:
                subcall_name = subcall.split('(')[0].strip().lstrip('*')
                subcall_set.add(subcall_name)
                if subcall_name not in function_map:
                    function_map[subcall_name] = []
            function_map[func_name] = list(subcall_set)
    return function_map

def build_dependency_tree(function_map: Dict[str, List[str]], func_name: str) -> Dict[str, Any]:
    # Create the tree starting from the provided function name
    for key in function_map.keys():
        if key == func_name:
            subcalls = []
            for subcall in function_map[key]:
                if (subcall == key):
                    subcalls.append({
                        "name": key + "...",
                        "children": []
                    })
                else:
                    subcalls.append(build_dependency_tree(function_map, subcall))

            return {
                    "name": key,
                    "children": subcalls
            }
    return {}

def dependency_tree(response: Functions) -> str:
    # Preprocess functions to create a mapping
    function_map = preprocess_functions(response)

    #print("FUNCTION MAP: ")
    #print(function_map)
    #print("END FUNCTION MAP ")
    
    # Find the main function as the root
    tree_root = build_dependency_tree(function_map, "main")
    
    # Convert the tree to a JSON string
    return json.dumps(tree_root, indent=2) 


def main():
    (example(
"""
#include "stdio.h"
#include "stdlib.h"

typedef struct NODE {
    int value;
    struct NODE* left;
    struct NODE* right;
} NODE;

void bruh() {
}

int nodes(NODE* root) {
    int sum = 0;
    int count = 0;
    if(root==NULL)return 0;
    if(root->left == NULL && root->right == NULL)return 0;

    sum += root->value;
    sum += nodes(root->left);
    sum += nodes(root->right);
    /*count++;
    count += nodes(root->left);
    count += nodes(root->right);*/
    return sum;
}

int isOddON(int num) {
    int isOdd = 0;
    while(num != 0) {
        num--;
        isOdd ^= isOdd;
    }
    return isOdd;
}

int isOddO1(int num) {
    switch(num) {
        case 0:
        return 0;
        case 1:
        return 1;
        case 2:
        return 0;
        case 3:
        return 1;
        default:
        return 0;
    }
}

int isOddO2(int num) {
    if(num == 0) {
        return 0;
    }
    else if(num == 1) {
        return 1;
    }
    else if(num == 2) {
        return 0;
    }
    return 0;
}

"""))


# if __name__ == "__main__":
#     main()
