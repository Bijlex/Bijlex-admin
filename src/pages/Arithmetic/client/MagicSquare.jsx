import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


function MagicSquare({ customData }) {
    const { bigSquares, smallSquares, answers, hiddenIndices } = customData;
   
    const [inputs, setInputs] = useState({});
  

    const handleChange = (e, index) => {
      setInputs({
        ...inputs,
        [index]: e.target.value
      });
    };

    const checkAnswers = () => {
      const correct = hiddenIndices.every((index, i) => {
        const userAnswer = parseInt(inputs[index], 10);
        return userAnswer === correctAnswers[i];
      });
      alert(correct ? 'Correct!' : 'Try again!');
    };

    const containerStyles = {
      display: 'grid',
      'grid-template-columns': 'repeat(2, 100px)',
      'grid-template-rows': 'repeat(2, 100px)',
      gap: 0,
      position: 'relative',
      width: '200px', /* 2 * 100px */
      height: '200px', /* 2 * 100px */
    };
    const bigSquareStyles = {
      width: '100px',
      height: '100px',
      'background-color': 'lightblue',
      border: '1px solid #000',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': '24px',
      position: 'relative',
    };
    const smallSquareStyles = {
      width: '30px',
      height: '30px',
      'background-color': 'lightcoral',
      border: '1px solid #000',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': '18px',
      position: 'absolute',
      transform:' translate(-50%, -50%)',
    };
    const answerSquareStyle = {
      'width': '50px',
      'height': '50px',
      'background-color': 'lightblue',
      'border': '1px solid #000',
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': '18px',
      'position': 'absolute',
      'transform': 'translate(-50%, -50%)'
    };

    const smallSquaresPositions = [
      { top: '52%', left: '75%' }, // between 1 and 3
      { top: '75%', left: '50%' }, // between 2 and 3
      { top: '52%', left: '25%' }, // between 0 and 2
      { top: '25%', left: '50%' }, // between 0 and 1
      { top: '25%', left: '100%' }, // right of 1
      { top: '99%', left: '25%' }, // bottom of 2
      { top: '99%', left: '75%' }, // bottom of 3
      { top: '75%', left: '100%' } // right of 3
    ];
    const answersPosition = [
      { top: '25%', left: '125%'}, // right of 1
      { top: '75%', left: '125%'}, // right of 3
      { top: '125%', left: '75%'}, // bottom of 3
      { top: '125%', left: '25%'}  // bottom of 2
    ];

    return (
      <div style={containerStyles}>
        {bigSquares.map((num, index) => (
          <div key={index} style={{...bigSquareStyles, gridArea: `${Math.floor(index / 2) + 1} / ${index % 2 + 1} / ${Math.floor(index / 2) + 2} / ${index % 2 + 2}`}}>
            {hiddenIndices.includes(index) ? (
              <input type="number" value={inputs[index] || ''} onChange={(e) => handleChange(e, index)} />
            ) : num}
          </div>
          
        ))}
        {smallSquares.map((item, index) => (
          
          <div key={index} style={{...smallSquareStyles, ...smallSquaresPositions[index]}} >
            {item}
          </div>
        ))}
        {answers.map((item, index) => (
          
          <div key={index} style={{...answerSquareStyle, ...answersPosition[index]}} >
            {hiddenIndices.includes(index + 4) ? (
              <input type="number" value={inputs[index + 4] || ''} onChange={(e) => handleChange(e, index + 4)} />
            ) : item}
          </div>
        ))}
         <div style={{ marginTop: '70px' }}>
          <button onClick={checkAnswers}>Check Answers</button>
        </div>
      </div>

      // ----------------------------------------------------------------

    //   <div className="container">
    //   {bigSquares.map((num, index) => (
    //     <div key={index} className="big-square" style={{ gridArea: `${Math.floor(index / 2) + 1} / ${index % 2 + 1} / ${Math.floor(index / 2) + 2} / ${index % 2 + 2}` }}>
    //       {hiddenIndices.includes(index) ? (
    //         <input type="number" value={inputs[index] || ''} onChange={(e) => handleChange(e, index)} />
    //       ) : num}
    //     </div>
    //   ))}
    //   {smallSquares.map((item, index) => (
    //     <div key={index} className="small-square" style={{ top: item.top, left: item.left }}>
    //       {item.operator}
    //     </div>
    //   ))}
    //   {answers.map((item, index) => (
    //     <div key={index} className="answer-square" style={{ top: item.top, left: item.left }}>
    //       {hiddenIndices.includes(index + 4) ? (
    //         <input type="number" value={inputs[index + 4] || ''} onChange={(e) => handleChange(e, index + 4)} />
    //       ) : item.answer}
    //     </div>
    //   ))}
    //    <div style={{ marginTop: '70px' }}>
    //     <button onClick={checkAnswers}>Check Answers</button>
    //   </div>
    // </div>
    );
}

export default MagicSquare;
