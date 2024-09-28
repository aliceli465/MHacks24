import React from "react";
import VscodeEditor from "./components/vscodeeditor";
import "./App.css"; // Custom styles

const code1 = `
// Sample C code 1
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`;

const code2 = `
// Sample C code 2
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(2, 3);
    printf("Sum: %d", sum);
    return 0;
}
`;

const App = () => {
  return (
    <div className="app-container">
      <header className="header">VSCode Themed Code Profiler</header>
      <div className="editors-wrapper">
        <div className="editor-half">
          <VscodeEditor code={code1} />
        </div>
        <div className="editor-half">
          <VscodeEditor code={code2} />
        </div>
      </div>
    </div>
  );
};

export default App;
