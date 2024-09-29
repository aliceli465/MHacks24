import sys
import os
import openai 
import dotenv
from dotenv import load_dotenv
sys.path.append(os.path.abspath('baml_ws'))


from parseFunctions import parseFunctions
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/getFunctions', methods=['POST'])
def getFunctions():
    try:
        data = request.json.get('content')
        print(data)
        print("------------------------------------")
        arr = parseFunctions(data)
        print("arr type is: ")
        print(type(arr))
        print("arr[all_functions] actually is: " )
        print(arr["all_functions"])
        return jsonify({"result": arr})

    except Exception as e:
        print(f"Error: {e}")  # Print the error message
        return jsonify({"error": str(e)}), 500

@app.route('/getFeedback', methods=['POST'])
def getFeedback():
    # in the format of [{info about func 1}, ...... {info about func n}]
    #in each dict, there is a
    #func_signature
    #func_sig_starting_line
    #func_bracket_end_line
    #func_body_wo_brackets
    #func_subcalls
    data = request.json.get('content')
    print("made it to getFeedback heres data")
    print(data)
    feedback_array = []
    try:
        for func_info in data:
            func_signature = func_info.get('func_signature', '')
            func_sig_starting_line = func_info.get('func_sig_starting_line', '')
            func_bracket_end_line = func_info.get('func_bracket_end_line', '')
            func_body_wo_brackets = func_info.get('func_body_wo_brackets', '')
            func_subcalls = func_info.get('func_subcalls', [])
            
            # Create the prompt to send to OpenAI
            prompt = f"Use dashes as bullet points (string formatted) and green/red circles (with good/green points first, then red) and analyze the following function and provide feedback in terms of memory usage, how efficient it is, any syntax/convention. Just give me the feedback, nothing like certainly! heres your feedback.\n\n"
            prompt += f"Function Signature: {func_signature}\n"
            prompt += f"Signature Starting Line: {func_sig_starting_line}\n"
            prompt += f"Bracket End Line: {func_bracket_end_line}\n"
            prompt += f"Function Body: {func_body_wo_brackets}\n"
            prompt += f"Subcalls: {', '.join(func_subcalls)}\n\n"
            prompt += " can be made?"

            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system","content":"You are helping somebody optimize their C code in terms of performance, memory usage, and syntax. Give concise feedback and compliments. Please also remove any symbols like * and ` but keep the green/red stuff"},
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
                max_tokens=300
            )
            fed = response['choices'][0]['message']['content']

            feedback_array.append(fed)
    
        for x in feedback_array:
            print("-------------------------------------------------------")
            print(type(x))
            print(x)
            print("-------------------------------------------------------")
        return jsonify(feedback_array)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)