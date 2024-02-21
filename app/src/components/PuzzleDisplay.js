// app/src/components/PuzzleDisplay.js
import React from 'react';

const PuzzleDisplay = ({ grid, clues }) => {
  return (
    <div
    style={{
        border: "solid", 
        margin: "20px",
        borderRadius: "5px",
        padding: "10px",
    }}>
        PUZZLE
      <div className="grid" style={{marginTop:'20px'}}>
        Grid:
        <ul>
          {Array.isArray(grid) && grid.map((g, index) => (
            <li key={index}>{g}</li>
          ))}
        </ul>
      </div>
      <div className="clues" style={{marginTop:'50px'}}>
        Clues:
        <ul>
          {Array.isArray(clues) && clues.map((clue, index) => (
            <li key={index}>{clue}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PuzzleDisplay;

