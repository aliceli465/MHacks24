import React, { useState } from "react";
import VscodeEditor from "./components/VscodeEditor";
import "./App.css"; // Custom styles

const App = () => {
  const [fileContent, setFileContent] = useState("");

  const handleImportClick = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="app-container">
      <header className="header">VSCode Themed Code Profiler</header>
      <div className="toolbar">
        <label className="import-button">
          Import File
          <input type="file" onChange={handleImportClick} style={{ display: "none" }} />
        </label>
      </div>
      <div className="editors-wrapper">
        <div className="editor-half">
          <VscodeEditor code={fileContent} />
        </div>
        <div className="editor-half">
          <VscodeEditor code={"// Right window"} />
        </div>
      </div>
    </div>
  );
};

export default App;
