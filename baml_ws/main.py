from baml_client.sync_client import b
from baml_client.types import Functions
from baml_client.types import RT


def GetFuncs(raw: str) -> Functions:
    # BAML's internal parser guarantees ExtractResume
    # to be always return a Resume type
    response = b.ExtractFunctions(raw)
    return response


def GetRTs(raw: str) -> RT:
    response = b.ExtractRuntimes(raw)
    return response.dict()


def main():
    st = str()
    with open("./callgrind.out.21668") as temp:
        st = temp.read()
    t = GetRTs(st)
    print(t)


if __name__ == "__main__":
    main()
