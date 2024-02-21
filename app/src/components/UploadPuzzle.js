// app/src/components/UploadPuzzle.js
import { useState } from 'react';

export default function UploadPuzzle({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/puzzles', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.puzzle_id) {
          alert('Puzzle uploaded successfully!');
          onUploadSuccess(data.puzzle_id); // Pass the puzzle_id to the callback
        } else {
          alert('Failed to upload puzzle.');
        }
      } else {
        alert('Failed to upload puzzle.');
      }
    } catch (error) {
      console.error('Error uploading puzzle:', error);
      alert('Error uploading puzzle.');
    }
  };

  return (
    <div 
        style={{
            border: "solid", 
            margin: "20px",
            borderRadius: "5px",
            padding: "10px"
        }}>
      <h1>Upload Crossword Puzzle</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button 
            type="submit"
            style={{border: 'solid', marginLeft: '10px', padding: '3px'}} 
            >
                Upload Puzzle
        </button>
      </form>
    </div>
  );
}
