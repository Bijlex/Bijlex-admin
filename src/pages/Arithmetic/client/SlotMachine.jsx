import React, { useState } from 'react';

const SlotMachine = ({ customData }) => {
  const [blocks, setBlocks] = useState([...Array(5).fill(null), '=']);
  const [lastBlock, setLastBlock] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const operators = ['+', '-', '*'];

  const generateRandomBlocks = () => {
    const newBlocks = blocks.map((block, index) => {
      if (index === 1 || index === 3) {
        // For the 2nd and 4th blocks, generate a random operator
        return operators[Math.floor(Math.random() * operators.length)];
      } else if (index === 5) {
        // For the 6th block (index 5), always set it to '='
        return '=';
      } else {
        // For the other blocks, generate a random number
        return Math.floor(Math.random() * 20);
      }
    });
    setBlocks(newBlocks);
    setIsCorrect(null); // Reset the correctness state when new blocks are generated
  };

  const checkAnswer = () => {
    // Calculate the result of the operation represented by the blocks
    const result = eval(blocks.join(''));
    // Check if the user's input matches the result
    setIsCorrect(result === Number(lastBlock));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      padding: '20px'
    }} className="slot-machine">
      <h2 style={{ marginBottom: '30px' }}>{customData?.questionPrompt || "No question prompt provided"}</h2>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '10px'
      }}>
        {blocks.map((block, index) => (
          <div key={index} style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            border: '1px solid #ddd'
          }} className="number-block">
            {block !== null ? block : ''}
          </div>
        ))}
      </div>
      <input 
        type="number" 
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: isCorrect !== null ? (isCorrect ? 'green' : 'red') : '#f5f5f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          border: '1px solid #ddd',
          marginBottom: '10px'
        }} 
        className={`number-block ${isCorrect !== null ? (isCorrect ? 'correct' : 'incorrect') : ''}`} 
        value={lastBlock} 
        onChange={(e) => setLastBlock(e.target.value)} 
        pattern="\d*" // Only allow digits to be entered
      />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button style={{
          width: '100px',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }} className="spin-button" onClick={generateRandomBlocks}>
          Spin
        </button>
        <button style={{
          width: '100px',
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }} className="check-button" onClick={checkAnswer}>
          Check
        </button>
      </div>
      {isCorrect !== null && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: isCorrect ? 'green' : 'red',
          color: 'white',
          borderRadius: '5px'
        }} className="result-message">
          {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
