from baml_ws.getFunctions import getFunctions
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)
@app.route('/getFunctions', methods=['POST'])
def getFunctions():
    try:
        print("hi")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)