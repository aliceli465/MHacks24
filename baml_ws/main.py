from baml_client.sync_client import b
from baml_client.types import Functions, OpCodes


def extractFuncs(raw: str) -> Functions:
    # BAML's internal parser guarantees ExtractResume
    # to be always return a Resume type
    response = b.ExtractFunctions(raw)
    return response.dict()


def OpFunctions(raw: str) -> OpCodes:
    # BAML's internal parser guarantees ExtractResume
    # to be always return a Resume type
    response = b.OptimizationSummary(raw)
    return response.dict()


# def main():
    # tmp = str()
    # with open("./camelCase.c") as t:
    #     tmp = t.read()
    # funcs = extractFuncs(tmp)
    # for i in funcs["all_functions"]:
    #     print(i["func_body_wo_brackets"])
    #     t = b.OptimizationSummary(i["func_body_wo_brackets"]).dict()
    #     print("\n Summary:")
    #     print(t["optimization_summary"])
    #     print("\n code:")
    #     print(t["newly_optimized_code"])
    #     print("\n\n\n\n\n\n")


if __name__ == "__main__":
    main()
