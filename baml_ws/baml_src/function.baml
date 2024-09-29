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

class RT {
  all_functions RTF[]
}

class RTF {
  func_signature string
  CPU_percentage float
  runtime_percentage float
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

function ExtractRuntimes(fn: string) -> RT {
    client "openai/gpt-4o"
    prompt #"
    Extract from this content:
    {{ fn }}

    {{ ctx.output_format }}
  "#
}
