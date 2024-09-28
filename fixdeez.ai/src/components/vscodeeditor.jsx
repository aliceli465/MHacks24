import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const VscodeEditor = ({ code }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Generate a random light color
  const generateLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  // This function is called when the editor mounts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor; // Keep a reference to the editor
    monacoRef.current = monaco; // Keep a reference to monaco
    highlightCode(editor, monaco); // Highlight the code initially
  };

  const colorPool = [
    "#FFE3D0", // light peach
    "#FFCCCC", // light coral
    "#FFD9C1", // light apricot
    "#FFB3C1", // light rose
    "#E5B2B2", // light muted red
    "#BFB0DB", // light violet
    "#99D5D6", // teal
    "#A4E1E0", // soft turquoise
    "#C6B6A6", // light brown
    "#F3E3B6", // light beige
    "#FFF3A6", // light lemon
    "#A56BDB", // light violet
    "#E7B2C2", // light mauve
    "#F7EBF9", // lavender
    "#FFB3A1", // light salmon
    "#AFA3D9", // light purple
    "#D7E9E7", // pale teal
    "#F7E6E6", // soft pink
    "#B7D8E5", // light blue
    "#B37777", // light maroon
    "#FFE7D3", // light orange
  ];

  // Set to keep track of visited colors
  const visitedColors = new Set();

  // Function to get a random color from the color pool that hasn't been used
  const getRandomColor = () => {
    if (visitedColors.size >= colorPool.length) {
      // If all colors have been used, you might want to reset or handle it
      console.warn("All colors have been used. Resetting color pool.");
      visitedColors.clear(); // Reset the visited set if all colors are used
    }

    let randomColor;
    do {
      const randomIndex = Math.floor(Math.random() * colorPool.length);
      randomColor = colorPool[randomIndex];
    } while (visitedColors.has(randomColor)); // Ensure the color hasn't been used

    // Mark the color as visited
    visitedColors.add(randomColor);
    return randomColor;
  };

  // Extract function ranges from code
  const extractFunctionRanges = (code, monaco) => {
    const regex =
      /([a-zA-Z_][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*\{)/g;
    const lines = code.split("\n");
    const decorations = [];
    let match;

    // Remove existing styles for previous highlights
    const existingStyles = document.querySelectorAll(
      ".function-highlight-style"
    );
    existingStyles.forEach((style) => style.remove());

    while ((match = regex.exec(code)) !== null) {
      const startLine = code.substring(0, match.index).split("\n").length;

      // Now find where the function ends (find corresponding closing brace)
      let braceCount = 0;
      let endLine = startLine;

      for (let i = startLine - 1; i < lines.length; i++) {
        braceCount += (lines[i].match(/{/g) || []).length;
        braceCount -= (lines[i].match(/}/g) || []).length;

        if (braceCount === 0) {
          endLine = i + 1;
          break;
        }
      }

      // Get a random color for this function
      const color = getRandomColor();
      const className = `highlight-code-${decorations.length}`; // Unique class for this function

      // Add decoration for this function with the randomly generated color
      decorations.push({
        range: new monaco.Range(startLine, 1, endLine, 1),
        options: {
          inlineClassName: className, // Apply a unique class for this function
          isWholeLine: true,
        },
      });

      // Add a dynamic style for function highlighting
      const styleTag = document.createElement("style");
      styleTag.className = "function-highlight-style"; // To identify these styles later
      styleTag.innerHTML = `
      .${className} { background-color: ${color}; color: #000000 !important; }
    `;
      document.head.appendChild(styleTag);
    }

    return decorations;
  };

  // Function to apply highlights
  const highlightCode = (editor, monaco) => {
    const model = editor.getModel(); // Get the model from the editor
    const lineCount = model.getLineCount(); // Get the number of lines in the model

    // Clear existing decorations
    editor.deltaDecorations([], []);

    // Extract function ranges and apply highlights
    const functionDecorations = extractFunctionRanges(code, monaco);
    functionDecorations.forEach((decoration) => {
      // Add the decoration for the function
      editor.deltaDecorations([], [decoration]);
    });
  };

  useEffect(() => {
    // Apply highlights whenever code changes
    if (editorRef.current && monacoRef.current) {
      highlightCode(editorRef.current, monacoRef.current);
    }
  }, [code]); // Listen to changes in code

  return (
    <div style={{ height: "90vh", width: "100%", backgroundColor: "#1E1E1E" }}>
      <Editor
        height="100%"
        defaultLanguage="c"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
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

export default VscodeEditor;
