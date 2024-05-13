import React, { useState } from 'react';

const styles = `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh; // This makes the container fill the height of the screen
}

.compass {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}

.direction-button {
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 1; 
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px; // Adjust font size to ensure text fits well
  text-transform: uppercase; // Optional: makes the text uppercase for consistency
}

.direction-button.selected {
  background-color: yellow; 
}

.direction-button.correct {
  background-color: green;
  color: white;
}  

.direction-button.incorrect {
  background-color: red; 
  color: white; 
}  

.compass-image {
  margin-top: 20px;
  position: absolute;
  width: 80%; 
  height: auto;
  z-index: 0; 
}

.N { top: 0; left: 50%; transform: translate(-50%, -50%); }
.NO { top: 0; right: 0; transform: translate(-90%, 100%); }
.O { top: 50%; right: 0; transform: translate(50%, -50%); }
.ZO { bottom: 0; right: 0; transform: translate(-100%, -90%); }
.Z { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
.ZW { bottom: 0; left: 0; transform: translate(90%, -100%); }
.W { top: 50%; left: 0; transform: translate(-50%, -50%); }
.NW { top: 0; left: 0; transform: translate(100%, 90%); }

button {
  padding: 10px 20px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

.start-button {
  background-color: blue;
  margin-bottom: 10px;
}

.check-button {
  background-color: green;
  margin-bottom: 10px;
}
`;

const Compass = ({ onSelectDirection, correctGuesses, selectedDirection, lastAttemptIncorrect }) => {
  const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'];
  return (
    <div className="compass">
      {directions.map((dir) => (
        <button
          key={dir}
          aria-label={dir}
          className={`direction-button ${dir} 
                      ${correctGuesses.has(dir) ? 'correct' : ''} 
                      ${selectedDirection === dir ? 'selected' : ''} 
                      ${lastAttemptIncorrect && selectedDirection === dir ? 'incorrect' : ''}`}
          onClick={() => onSelectDirection(dir)}
        >
          {correctGuesses.has(dir) ? dir : ''}
        </button>
      ))}
      <img src="images/CompassExercise/compass.png" alt="Compass" className="compass-image" />
    </div>
  );
};

function CompassExercise({ customData }) {
  const [direction, setDirection] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState(new Set());
  const [lastAttemptIncorrect, setLastAttemptIncorrect] = useState(false);
  const [allGuessed, setAllGuessed] = useState(false);
  const questionPrompt = customData?.questionPrompt || "No prompt provided";

  const handleSelectDirection = (direction) => {
    setSelectedDirection(direction);
    setLastAttemptIncorrect(false);
  };

  const generateRandomDirection = () => {
    const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'];
    const availableDirections = directions.filter(dir => !correctGuesses.has(dir));

    if (availableDirections.length > 0) {
      const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      setDirection(randomDirection);
      setSelectedDirection('');
      setLastAttemptIncorrect(false);
    } else {
      setAllGuessed(true);
    }
  };

  const resetAndStart = () => {
    setCorrectGuesses(new Set());
    setSelectedDirection('');
    setLastAttemptIncorrect(false);
    setAllGuessed(false);
    generateRandomDirection(); 
  };

  const checkAnswer = () => {
    if (selectedDirection === direction) {
      const newCorrectGuesses = new Set(correctGuesses.add(selectedDirection));
      setCorrectGuesses(newCorrectGuesses);

      if (newCorrectGuesses.size === 8) {
        setAllGuessed(true);
      } else {
        generateRandomDirection(); 
      }

      setLastAttemptIncorrect(false);
    } else {
      setLastAttemptIncorrect(true);
    }
  };

  return (
    <div className="container">
      <style>{styles}</style>
      <h2>{questionPrompt}</h2>
      <button className="start-button" onClick={resetAndStart}>Begin met oefenen</button>
      <h3>Gegenereerde richting: {direction || "None"}</h3>
      <Compass
        onSelectDirection={handleSelectDirection}
        correctGuesses={correctGuesses}
        selectedDirection={selectedDirection}
        lastAttemptIncorrect={lastAttemptIncorrect}
      />
      <button className="check-button" style={{marginTop: '70px'}} onClick={checkAnswer} disabled={!direction || !selectedDirection}>
        Antwoord nakijken
      </button>
      <div className={`message-container ${allGuessed ? 'visible' : ''}`}>
        {allGuessed ? "Gefeliciteerd! Alle richtingen zijn correct geraden!" : ""}
      </div>
    </div>
  );
}

export default CompassExercise;
