import React, { useState } from 'react';

const SlotMachine = () => {
  const [blocks, setBlocks] = useState(Array(7).fill(null)); // Increase the size of the array to 7
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctOperator1, setCorrectOperator1] = useState(null); // Store the correct operator1
  const [correctOperator2, setCorrectOperator2] = useState(null); // Store the correct operator2

  const operators = ['+', '-', '*'];

  const generateRandomBlocks = () => {
    const operator1 = operators[Math.floor(Math.random() * operators.length)]; // Generate a random operator1
    let operator2 = operators[Math.floor(Math.random() * operators.length)]; // Generate a random operator2
    while (operator2 === operator1) { // Ensure operator2 is not the same as operator1
      operator2 = operators[Math.floor(Math.random() * operators.length)];
    }
    setCorrectOperator1(operator1); // Set the correct operator1
    setCorrectOperator2(operator2); // Set the correct operator2

    const newBlocks = blocks.map((block, index) => {
      if (index % 2 === 0 || index === 5) {
        // For blocks 1, 3, 5, and the 6th (index 5), generate random numbers or '='
        return index === 5 ? '=' : Math.floor(Math.random() * 10);
      } else if (index === 3) {
        // For block 4, leave it as null for user input
        return null;
      } else {
        // For other blocks, use the generated operators
        return index === 1 ? operator1 : operator2;
      }
    });

    // Calculate the result based on blocks 1, 3, 5 and the generated operators
    const result = eval(`${newBlocks[0]} ${operator1} ${newBlocks[2]} ${operator2} ${newBlocks[4]}`); // Evaluate the expression
    newBlocks[6] = result; // Set the result in the 7th block

    setBlocks(newBlocks);
    setIsCorrect(null); // Reset correctness state
  };

  const checkAnswer = () => {
    const result = eval(blocks.slice(0, 5).join('')); // Calculate the expected result
    setIsCorrect(result === blocks[6]); // Check against the 7th block for correctness
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
      }}>
        {blocks.map((block, index) => (
          <div key={index} style={{
            width: '50px',
            height: '50px',
            border: '1px solid #000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            backgroundColor: index === 3 ? '#f0f0f0' : '#fff', // Background color for input block
          }} className={`number-block ${index === 3 ? 'input-block' : ''}`}>
            {index !== 3 ? block : (
              <input
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  textAlign: 'center',
                  fontSize: '20px',
                  outline: 'none',
                }}
                type="text"
                value={blocks[index] || ''}
                onChange={(e) => {
                  const updatedBlocks = [...blocks];
                  updatedBlocks[index] = e.target.value;
                  setBlocks(updatedBlocks);
                }}
                pattern="[+\\-\\*]" // Only allow operators to be entered in the input block
              />
            )}
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
      }}>
        <button style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }} className="spin-button" onClick={generateRandomBlocks}>
          Spin
        </button>
        <button style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }} className="check-button" onClick={checkAnswer}>
          Check
        </button>
      </div>
      {isCorrect !== null && (
        <div style={{
          marginTop: '20px',
          fontSize: '20px',
          color: isCorrect ? 'green' : 'red',
          fontWeight: 'bold',
        }} className="result-message">
          {isCorrect ? 'Correct!' : `Incorrect. The correct operators are ${correctOperator1} and ${correctOperator2}. Try again.`}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
