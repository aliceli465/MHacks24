from baml_client.sync_client import b
from baml_client.types import Functions


def parseFunctions(raw_resume: str) -> Functions:
    # BAML's internal parser guarantees ExtractResume
    # to be always return a Resume type
    response = b.ExtractFunctions(raw_resume)
    return response.dict()


def example(raw_resume: str) -> Functions:
    print("------------------------")
    print("inside parse functions")
    stream = b.stream.ExtractFunctions(raw_resume)
    # for msg in stream:
    #     print(msg)  # This will be a PartialResume type
    # This will be a Resume type
    final = stream.get_final_response()
    return final


# def main():
#     (example_stream(
# """
# #include "stdio.h"
# #include "stdlib.h"

# typedef struct NODE {
#     int value;
#     struct NODE* left;
#     struct NODE* right;
# } NODE;

# void bruh() {
# }

# int nodes(NODE* root) {
#     int sum = 0;
#     int count = 0;
#     if(root==NULL)return 0;
#     if(root->left == NULL && root->right == NULL)return 0;

#     sum += root->value;
#     sum += nodes(root->left);
#     sum += nodes(root->right);
#     /*count++;
#     count += nodes(root->left);
#     count += nodes(root->right);*/
#     return sum;
# }

# int isOddON(int num) {
#     int isOdd = 0;
#     while(num != 0) {
#         num--;
#         isOdd ^= isOdd;
#     }
#     return isOdd;
# }

# int isOddO1(int num) {
#     switch(num) {
#         case 0:
#         return 0;
#         case 1:
#         return 1;
#         case 2:
#         return 0;
#         case 3:
#         return 1;
#         default:
#         return 0;
#     }
# }

# int isOddO2(int num) {
#     if(num == 0) {
#         return 0;
#     }
#     else if(num == 1) {
#         return 1;
#     }
#     else if(num == 2) {
#         return 0;
#     }
#     return 0;
# }

# """))


# if __name__ == "__main__":
#     main()
