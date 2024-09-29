import React, { useState, useEffect } from "react";
import VscodeEditor from "./components/VscodeEditor";
import FunctionBubble from "./components/FunctionBubble";
import DependencyGraph from "./components/dependencyGraph";
import "./App.css"; // Custom styles

const App = () => {
  const [activeDiv, setActiveDiv] = useState(null);

  const handleButtonClick = (divName) => {
    setActiveDiv(divName);
  };
  const [fileContent, setFileContent] = useState("");
  const [functionDetails, setFunctionDetails] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valgrindOutput, setValgrindOutput] = useState("");

  const handleFunctionDetailsChange = (details) => {
    setFunctionDetails(details);
  };

  const handleImportClick = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        setFileContent(fileContent);

        try {
          const response2 = await fetch("http://127.0.0.1:5000/getFunctions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: fileContent }),
          });

          const valgrindResponse = await fetch(
            "http://127.0.0.1:5000/save-and-run-valgrind",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: file.name,
                content: fileContent,
              }),
            }
          );

          const val = await valgrindResponse.json();
          const valOutput = val.valgrind_output;
          setValgrindOutput(valOutput);

          const data = await response2.json();
          const allFunctions = data.result.all_functions;
          console.log("allFunctions is:");
          console.log(allFunctions);
          setFunctionData(allFunctions);
        } catch (error) {
          console.error("found error: ", error);
        }
      };

      reader.readAsText(file);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (functionData.length > 0) {
      // Only gather feedback if there's data
      gatherFeedback();
    }
  }, [functionData]); // Dependency array

  const gatherFeedback = async () => {
    console.log("in gather feedback now, heres functionData");
    console.log(functionData);
    try {
      const response = await fetch("http://127.0.0.1:5000/getFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: functionData }),
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
      }

      const feedbacks = await response.json();
      setFeedback(feedbacks);
    } catch (error) {
      console.log("error was: " + error);
      console.error("found error: ", error);
    }
  };
  useEffect(() => {
    if (feedback.length > 0) {
      console.log("Updated feedback:");
      console.log(feedback);
      setIsFeedbackDone(true);
      setIsLoading(false);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [feedback]);
  return (
    <>
      <div className="app-container">
        <header className="header">VSCode Themed Code Profiler</header>
        <div className="toolbar">
          <label className="import-button">
            Import File
            <input
              type="file"
              onChange={handleImportClick}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="main-heading">
          <h3>Original Code</h3>
          {isLoading ? <h3>Loading ...</h3> : null}
        </div>
        <div className="editors-wrapper">
          <div className="editor-half">
            <VscodeEditor
              code={fileContent}
              functionData={functionData}
              onFunctionDetailsChange={handleFunctionDetailsChange}
            />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1>Results</h1>
          <h3>Click each tab for more info</h3>
        </div>

        <div className="button-row">
          <button onClick={() => handleButtonClick("div1")} className="button">
            Documentation
          </button>
          <button onClick={() => handleButtonClick("div2")} className="button">
            Dependency Graph
          </button>
          <button onClick={() => handleButtonClick("div3")} className="button">
            Optimization
          </button>
          <button onClick={() => handleButtonClick("div4")} className="button">
            Profiling
          </button>
        </div>

        <div className="content-area">
          {activeDiv === "div1" && <div className="content">This is Div 1</div>}
          {activeDiv === "div2" && (
            <div className="content">
              <DependencyGraph />
            </div>
          )}
          {activeDiv === "div3" && <div className="content">This is Div 3</div>}
          {activeDiv === "div4" && <div className="content">This is Div 4</div>}
        </div>

        {isFeedbackDone ? (
          <>
            <div style={{ textAlign: "center" }}>
              <h1>Results</h1>
              <h3>Click each tab for more info</h3>
            </div>
            <div>
              <div className="ugh">
                <div id="functionsYay" className="function-bubbles-container">
                  {functionDetails.map((func, index) => (
                    <FunctionBubble
                      key={index}
                      functionName={func.name}
                      explanation={feedback[index]}
                      color={func.color}
                    />
                  ))}
                </div>
                <div className="right-container">
                  {/* <DependencyGraph /> */}
                  <p>hihihi</p>
                </div>
              </div>
              {/* <div className="right-container">
                <DependencyGraph />
              </div> */}
            </div>
          </>
        ) : null}
        <div id="omghehe"></div>
      </div>
    </>
  );
};

export default App;
