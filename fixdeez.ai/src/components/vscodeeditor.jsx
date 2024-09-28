import React from "react";
import Editor from "@monaco-editor/react";

const VscodeEditor = ({ code }) => {
  return (
    <div style={{ height: "90vh", width: "100%", backgroundColor: "#1E1E1E" }}>
      <Editor
        height="90vh"
        defaultLanguage="c"
        defaultValue={code}
        theme="vs-dark"
        options={{
          fontFamily: "Fira Code, monospace",
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: "on",
        }}
      />
    </div>
  );
};

export default VscodeEditor;
