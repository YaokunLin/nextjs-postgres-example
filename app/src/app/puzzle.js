// app/src/app/puzzle.js
import React, { useEffect, useState } from 'react';
import PuzzleDisplay from '../components/PuzzleDisplay';
import UploadPuzzle from '../components/UploadPuzzle';

const PuzzlePage = () => {
    const [puzzleData, setPuzzleData] = useState({ grid: null, clues: [] });
    const [puzzleId, setPuzzleId] = useState(null);
  
    const fetchPuzzleData = (id) => {
      fetch(`/api/puzzles/${id}/grid`)
        .then(response => response.json())
        .then(data => setPuzzleData(data))
        .catch(error => console.error('Error fetching puzzle data:', error));
    };
  
    const handleUploadSuccess = (id) => {
      setPuzzleId(id); // Update the puzzleId state
      fetchPuzzleData(id); // Fetch the puzzle data with the new id
    };
  
    useEffect(() => {
      if (puzzleId) {
        fetchPuzzleData(puzzleId);
      }
    }, [puzzleId]);

  return (
    <div>
      <UploadPuzzle onUploadSuccess={handleUploadSuccess} />
      <PuzzleDisplay grid={puzzleData.grid} clues={puzzleData.clues} />
    </div>
  );
};

export default PuzzlePage;
