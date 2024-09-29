import React, { useState, useEffect } from "react";
import VscodeEditor from "./components/VscodeEditor";
import FunctionBubble from "./components/FunctionBubble";
import DependencyGraph from "./components/dependencyGraph";
import "./App.css"; // Custom styles

const pasta =
  "can we honestly e date? you’re so beautiful. You always make me laugh, you always make me smile. You literally make me want to become a better person... I really enjoy every moment we spend together. My time has no value unless its spent with you. I tell everyone of my irls how awesome you are. Thank you for being you. Whenever you need someone to be there for you, know that i’ll always be right there by your side. I love you so much. I don’t think you ever realize how amazing you are sometimes. Life isn’t as fun when you’re not around. You are truly stunning. I want you to be my soulmate. I love the way you smile, your eyes are absolutely gorgeous. If I had a star for everytime you crossed my mind i could make the entire galaxy. Your personality is as pretty as you are and thats saying something. I love you, please date me. I am not even calling it e dating anymore because I know we will meet soon enough heart OK I ADMIT IT I LOVE YOU OK i hecking love you and it breaks my heart when i see you play with someone else or anyone commenting in your profile i just want to be your girlfriend and put a heart in my profile linking to your profile and have a walltext of you commenting cute things i want to play video games talk in discord all night and watch a movie together but you just seem so uninsterested in me it hecking kills me and i cant take it anymore i want to remove you but i care too much about you so please i’m begging you to eaither love me back or remove me and never contact me again it hurts so much to say this because i need you by my side but if you dont love me then i want you to leave because seeing your icon in my friendlist would kill me everyday of my pathetic life.";
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
                    width: "100px",
                    marginLeft: "2%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <VscodeEditor
                    code={fileContent}
                    functionData={functionData}
                    onFunctionDetailsChange={handleFunctionDetailsChange}
                  />
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
