import React from "react";
import { Tree, NodeModel } from "react-d3-tree";

// Sample data (the dependency tree)
const dependencyTree = {
  name: "main",
  children: [
    {
      name: "printf",
      children: [],
    },
    {
      name: "scanf",
      children: [],
    },
    {
      name: "factorial",
      children: [
        {
          name: "factorial...",
          children: [],
        },
      ],
    },
  ],
};

const DependencyGraph = () => {
  // Define the styles for nodes
  const nodeSize = { x: 200, y: 100 };

  const renderCustomNode = ({ nodeData }) => {
    return (
      <g>
        <circle r={15} fill="black" />
        <text fill="black" strokeWidth="0.5" stroke="white" x="20" y="5">
          {nodeData.name}
        </text>
      </g>
    );
  };

  return (
    <div style={{ height: "500px" }}>
      <Tree
        data={dependencyTree}
        renderCustomNode={renderCustomNode}
        nodeSize={nodeSize}
        translate={{ x: 400, y: 50 }} // Adjust the position as needed
      />
    </div>
  );
};

export default DependencyGraph;
