// Defining a data model.
class Functions {
  all_functions Function[]
}

class Function {
  func_signature string
  func_sig_starting_line int
  func_bracket_end_line int
  func_body_wo_brackets string
  func_subcalls string[]
}

class OpCodes {
  optimization_summary string
  newly_optimized_code string
}

// Creating a function to extract the resume from a string.
function ExtractFunctions(fn: string) -> Functions {
  client "openai/gpt-4o" // Set OPENAI_API_KEY to use this client.
  prompt #"
    Extract from this content:
    {{ fn }}

    {{ ctx.output_format }}
  "#
}

function OptimizationSummary(fn_body: string) -> OpCodes {
  client "openai/gpt-4o" //
  prompt #"
    The following function may be inefficient. Suggest any optimizations to decrease the runtime. If there are no optimizations to be made, return code as is. Do not rewrite newlines. Leave escapes as is, do not escape \ or backslash
    Function:
    {{fn_body}}
    
    Extract it into the following format
    {{ ctx.output_format }}
  "#
}


// Testing the function with a sample resume.
test vaibhav_resume {
  functions [ExtractFunctions]
  args {
    resume #"
      Vaibhav Gupta
      vbv@boundaryml.com

      Experience:
      - Founder at BoundaryML
      - CV Engineer at Google
      - CV Engineer at Microsoft

      Skills:
      - Rust
      - C++
    "#
  }
}
