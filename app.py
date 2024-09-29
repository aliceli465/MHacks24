import sys
import os
import openai 
import dotenv
import shutil
from dotenv import load_dotenv
sys.path.append(os.path.abspath('baml_ws'))

import subprocess


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

@app.route('/getSummaries', methods=['POST'])
def getSummaries():
    data = request.json.get('content')
    summaries = []
    try:
        for func_info in data:
            func_signature = func_info.get('func_signature', '')
            func_sig_starting_line = func_info.get('func_sig_starting_line', '')
            func_bracket_end_line = func_info.get('func_bracket_end_line', '')
            func_body_wo_brackets = func_info.get('func_body_wo_brackets', '')
            func_subcalls = func_info.get('func_subcalls', [])
            
            # Create the prompt to send to OpenAI
            prompt = f"\n\n"
            prompt += f"Function Signature: {func_signature}\n"
            prompt += f"Signature Starting Line: {func_sig_starting_line}\n"
            prompt += f"Bracket End Line: {func_bracket_end_line}\n"
            prompt += f"Function Body: {func_body_wo_brackets}\n"
            prompt += f"Subcalls: {', '.join(func_subcalls)}\n\n"

            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system","content":"Give me a concise summary of what each function is doing (No introductory phrases like here you go or heres a summary)."},
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
                max_tokens=300
            )
            fed = response['choices'][0]['message']['content']

            summaries.append(fed)
    
        # for x in feedback_array:
        #     print("-------------------------------------------------------")
        #     print(type(x))
        #     print(x)
        #     print("-------------------------------------------------------")
        return jsonify(summaries)

    except Exception as e:
        print(f"Error: {e}")
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
            prompt = f"Do not give me a function summary.\n\n"
            prompt += f"Function Signature: {func_signature}\n"
            prompt += f"Signature Starting Line: {func_sig_starting_line}\n"
            prompt += f"Bracket End Line: {func_bracket_end_line}\n"
            prompt += f"Function Body: {func_body_wo_brackets}\n"
            prompt += f"Subcalls: {', '.join(func_subcalls)}\n\n"

            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system","content":"You are helping somebody optimize their C code in terms of performance, memory usage, and syntax. Use dashes as bullet points (please add new lines since this will be going into html later) and green/red circles (with good/green points first, then red) and aanlyze these functions based on the below. Just give me feedback, nothing like certainly heres your feedback. Please make every function feedback the same format, and no code examples just suggestions."},
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
                max_tokens=300
            )
            fed = response['choices'][0]['message']['content']

            feedback_array.append(fed)
    
        # for x in feedback_array:
        #     print("-------------------------------------------------------")
        #     print(type(x))
        #     print(x)
        #     print("-------------------------------------------------------")
        return jsonify(feedback_array)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


SAVE_FOLDER = './C_File/'
os.makedirs(SAVE_FOLDER, exist_ok=True)

@app.route('/save-and-run-valgrind', methods=['POST'])
def save_and_run_valgrind():
    data = request.get_json()
    filename = data.get('filename')
    file_content = data.get('content')
    
    if not filename or not file_content:
        return jsonify({'error': 'Invalid file or content'}), 400
    
    if os.path.exists(SAVE_FOLDER) and os.listdir(SAVE_FOLDER):
        # Remove all files and folders inside the save folder
        shutil.rmtree(SAVE_FOLDER)
        os.makedirs(SAVE_FOLDER)
    # Save the file to the same directory as app.py
    file_path = os.path.join(SAVE_FOLDER, filename)
    try:
        with open(file_path, 'w') as f:
            f.write(file_content)
        
        # Compile the C file
        executable_path = compile_c_file(file_path)
        if not executable_path:
            return jsonify({'error': 'Compilation failed'}), 500
        print("our output path is: ")
        print(executable_path)
        # Run Valgrind on the compiled executable
        valgrind_output = run_valgrind_on_executable(executable_path)
        if valgrind_output:
            print("heres the nice valgrind output: ")
            print(valgrind_output)
            return jsonify({'valgrind_output': valgrind_output})
        else:
            return jsonify({'error': 'Valgrind execution failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def compile_c_file(c_file_path):
    output_file = 'main.exe'
    try:
        # Compile the C file using gcc
        compile_cmd = f"gcc {c_file_path} -o {output_file}"
        subprocess.run(compile_cmd, shell=True, check=True)
        print("Compilation successful.")
        return output_file
    except subprocess.CalledProcessError:
        print("Compilation failed.")
        return None

def run_valgrind_on_executable(executable_path):
    try:
        # Run Valgrind with memory leak check
        valgrind_cmd = f"valgrind --leak-check=full main.exe"
        result = subprocess.run(valgrind_cmd, shell=True, capture_output=True, text=True)
        print("Valgrind executed successfully.")
        print(result)
        return result
    except Exception as e:
        print(f"Valgrind execution failed: {e}")
        return None

if __name__ == "__main__":
    app.run(debug=True)