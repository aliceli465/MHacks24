import React, { useState } from "react";
import VscodeEditor from "./components/VscodeEditor";
import "./App.css"; // Custom styles

const App = () => {
  const [cFileContent, setCFileContent] = useState("");
  const [cFileName, setCFileName] = useState("");
  const [binaryFileName, setBinaryFileName] = useState("");
  const [compileCommand, setCompileCommand] = useState("");

  const handleImportCFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCFileContent(e.target.result);
      reader.readAsText(file);
      setCFileName(file.name);
    }
  };

  const handleImportBinaryFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBinaryFileName(file.name);
    }
  };

  const handleRemoveCFile = () => {
    setCFileContent("");
    setCFileName("");
  };

  const handleRemoveBinaryFile = () => {
    setBinaryFileName("");
  };

  return (
    <div className="app-container">
      <header className="header">VSCode Themed Code Profiler</header>
      <div className="toolbar">
        <div className="import-section-container">
          <div className="import-section">
            <label className="import-button">
              Import C File
              <input type="file" onChange={handleImportCFile} style={{ display: "none" }} />
            </label>
            {cFileName && (
              <div className="file-info">
                <span>{cFileName}</span>
                <button className="remove-file" onClick={handleRemoveCFile}>x</button>
              </div>
            )}
          </div>
          <div className="import-section">
            <label className="import-button">
              Import Binary File
              <input type="file" onChange={handleImportBinaryFile} style={{ display: "none" }} />
            </label>
            {binaryFileName && (
              <div className="file-info">
                <span>{binaryFileName}</span>
                <button className="remove-file" onClick={handleRemoveBinaryFile}>x</button>
              </div>
            )}
          </div>
        </div>
        <div className="command-section">
          <label>Compile Command: </label>
          <input
            type="text"
            value={compileCommand}
            onChange={(e) => setCompileCommand(e.target.value)}
            placeholder="Enter compile command (e.g., gcc file.c -o file)"
            className="command-input"
          />
        </div>
      </div>
      <div className="editors-wrapper">
        <div className="editor-half">
          <VscodeEditor code={cFileContent} />
        </div>
        <div className="editor-half">
          <VscodeEditor code={`// Binary file content`} />
        </div>
      </div>
    </div>
  );
};

export default App;
