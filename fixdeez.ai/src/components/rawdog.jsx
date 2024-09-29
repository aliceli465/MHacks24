import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const SimpleVscodeEditor = ({ code }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // This function is called when the editor mounts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor; // Keep a reference to the editor
    monacoRef.current = monaco; // Keep a reference to monaco
  };

  useEffect(() => {
    // Optionally, you can perform actions when code changes
    if (editorRef.current) {
      editorRef.current.setValue(code); // Update the editor value
    }
  }, [code]); // Listen to changes in code

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1E1E1E",
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="plaintext" // Use plaintext for raw string
        value={code} // Set the initial value
        theme="vs-dark"
        options={{
          readOnly: true, // Set to true if you want it to be read-only
          fontFamily: "Fira Code, monospace",
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: "on",
        }}
        onMount={handleEditorDidMount} // Mount the editor and pass references
      />
    </div>
  );
};

export default SimpleVscodeEditor;
