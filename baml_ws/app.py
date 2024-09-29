from flask_cors import CORS
from flask import Flask, request, jsonify
from parseFunctions import parseFunctions
import sys
import os
sys.path.append(os.path.abspath('baml_ws'))


app = Flask(__name__)
CORS(app)


@app.route('/getFunctions', methods=['POST'])
def getFunctions():
    try:
        data = request.json.get('content')
        print(data)
        print("------------------------------------")
        arr = parseFunctions(data)
        print("arr type is: ")
        print(type(arr))
        print("arr[all_functions] actually is: ")
        print(arr["all_functions"])
        return jsonify({"result": arr})

    except Exception as e:
        print(f"Error: {e}")  # Print the error message
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True,host="0")
