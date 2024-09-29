import React, { useState, useEffect } from "react";
import VscodeEditor from "./components/VscodeEditor";
import FunctionBubble from "./components/FunctionBubble";
import DependencyGraph from "./components/dependencyGraph";
import SimpleVscodeEditor from "./components/rawdog";
import "./App.css"; // Custom styles

const App = () => {
  const [activeDiv, setActiveDiv] = useState(null);

  const handleButtonClick = (divName) => {
    setActiveDiv(divName);
  };
  const [fileContent, setFileContent] = useState("");
  const [functionDetails, setFunctionDetails] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valgrindOutput, setValgrindOutput] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [feedback, setFeedback] = useState([]);

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

          const opt_code_resp = await fetch(
            "http://127.0.0.1:5000/getOptimizedCode",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: fileContent }),
            }
          );

          const opt_data = await opt_code_resp.json();
          console.log("optimized code data is: ");
          console.log(opt_data.newly_optimized_code);
          const yay_code = opt_data.newly_optimized_code;
          setOptimizedCode(yay_code);

          const data = await response2.json();
          const allFunctions = data.result.all_functions;
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
      gatherSummaries();
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

  const gatherSummaries = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/getSummaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: functionData }),
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
      }

      const summaries = await response.json();
      setSummaries(summaries);
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
        <header className="header">plzFix.ai</header>
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
          {isLoading ? <h3 className="loading">Processing...</h3> : null}
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

        {isFeedbackDone ? (
          <>
            <div style={{ textAlign: "center" }}>
              <h1>Results</h1>
              <h3>Click each tab for more info</h3>
            </div>

            <div className="button-row">
              <button
                onClick={() => handleButtonClick("div1")}
                className="button"
              >
                Documentation
              </button>
              <button
                onClick={() => handleButtonClick("div2")}
                className="button"
              >
                Dependency Graph
              </button>
              <button
                onClick={() => handleButtonClick("div3")}
                className="button"
              >
                Optimization/Profiling
              </button>
            </div>

            <div
              style={{
                display: activeDiv === "div3" ? "flex" : "block",
                justifyContent:
                  activeDiv === "div3" ? "space-between" : undefined, // Omit for default behavior
                width: "100%",
              }}
            >
              <div className="content-area" style={{ flex: 1 }}>
                {activeDiv === "div1" && (
                  <div className="content">
                    <div
                      id="functionsYay"
                      className="function-bubbles-container"
                    >
                      {functionDetails.map((func, index) => (
                        <FunctionBubble
                          key={index}
                          functionName={func.name}
                          explanation={summaries[index]}
                          color={func.color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {activeDiv === "div2" && (
                  <div className="content">
                    <DependencyGraph />
                  </div>
                )}
                {activeDiv === "div3" && (
                  <div className="content">
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {functionDetails.map((func, index) => (
                        <li
                          key={index}
                          style={{
                            margin: "10px 0",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                          }}
                        >
                          <p style={{ color: "black" }}>{func.name}</p>
                          <div
                            style={{ fontSize: "15px", paddingLeft: "20px" }}
                          >
                            {feedback[index]
                              .split("\n")
                              .map((line, lineIndex) => {
                                if (line.startsWith("-")) {
                                  return (
                                    <li
                                      key={lineIndex}
                                      style={{ color: "darkgray" }}
                                    >
                                      {line.trim()}
                                    </li>
                                  );
                                }
                                return (
                                  <p
                                    key={lineIndex}
                                    style={{ margin: "5px 0" }}
                                  >
                                    {line}
                                  </p>
                                );
                              })}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {activeDiv === "div3" && (
                <div
                  style={{
                    flex: 1,
                    border: "1px solid #3c3c3c",
                    width: "100px", // Consider using a more flexible width like "100%"
                    marginLeft: "2%",
                  }}
                >
                  <SimpleVscodeEditor code={optimizedCode} />
                </div>
              )}
            </div>
          </>
        ) : null}
        <div id="omghehe"></div>
      </div>
    </>
  );
};

export default App;
