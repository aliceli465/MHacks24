// Defining a data model.
class Functions {
  all_functions Function[]
}

class Function {
  func_signature string
  func_body_wo_brackets string
  func_subcalls string[]
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
