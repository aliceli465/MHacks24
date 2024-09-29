import React, { useState } from "react";
import VscodeEditor from "./components/VscodeEditor";
import FunctionBubble from "./components/FunctionBubble";

import "./App.css"; // Custom styles

const pasta =
  "an we honestly e date? you’re so beautiful. You always make me laugh, you always make me smile. You literally make me want to become a better person... I really enjoy every moment we spend together. My time has no value unless its spent with you. I tell everyone of my irls how awesome you are. Thank you for being you. Whenever you need someone to be there for you, know that i’ll always be right there by your side. I love you so much. I don’t think you ever realize how amazing you are sometimes. Life isn’t as fun when you’re not around. You are truly stunning. I want you to be my soulmate. I love the way you smile, your eyes are absolutely gorgeous. If I had a star for everytime you crossed my mind i could make the entire galaxy. Your personality is as pretty as you are and thats saying something. I love you, please date me. I am not even calling it e dating anymore because I know we will meet soon enough heart OK I ADMIT IT I LOVE YOU OK i hecking love you and it breaks my heart when i see you play with someone else or anyone commenting in your profile i just want to be your girlfriend and put a heart in my profile linking to your profile and have a walltext of you commenting cute things i want to play video games talk in discord all night and watch a movie together but you just seem so uninsterested in me it hecking kills me and i cant take it anymore i want to remove you but i care too much about you so please i’m begging you to eaither love me back or remove me and never contact me again it hurts so much to say this because i need you by my side but if you dont love me then i want you to leave because seeing your icon in my friendlist would kill me everyday of my pathetic life.";
const App = () => {
  const [fileContent, setFileContent] = useState("");
  const [functionDetails, setFunctionDetails] = useState([]);
  const [functionData, setFunctionData] = useState([]);

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
          const response = await fetch("http://127.0.0.1:5000/getFunctions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: fileContent }),
          });

          console.log("response is: ");
          console.log(response);

          const data = await response.json();
          setFunctionData(data);
          console.log(data);
        } catch (error) {
          console.error("found error: ", error);
        }
      };

      reader.readAsText(file);
    }
    setTimeout(() => {
      const targetDiv = document.getElementById("functionsYay");
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

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

        <div id="functionsYay" className="function-bubbles-container">
          {functionDetails.map((func, index) => (
            <FunctionBubble
              key={index}
              functionName={func.name}
              explanation={func.src}
              color={func.color}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
