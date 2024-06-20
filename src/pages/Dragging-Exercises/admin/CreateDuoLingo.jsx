import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

const AnswerBlock = ({ answer }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'answer',
    item: { answer },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className='answer-option-main__div' ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <h3>{answer}</h3>
    </div>
  );
};

const DropSpace = ({ onDrop, expectedAnswer, checkAnswers }) => {
  const [droppedAnswer, setDroppedAnswer] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'answer',
    drop: (item, monitor) => {
      onDrop(item.answer);
      setDroppedAnswer(item.answer);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (checkAnswers && droppedAnswer) {
      setBackgroundColor(droppedAnswer === expectedAnswer ? 'green' : 'red');
    }
  }, [checkAnswers, droppedAnswer, expectedAnswer]);

  return (
    <span className='drop-space' ref={drop} style={{ backgroundColor: checkAnswers ? backgroundColor : 'transparent' }}>
      {droppedAnswer || ""}
    </span>
  );
};

const Paragraph = ({ text, correctText, checkAnswers }) => {
  const [state, setState] = useState(Array(text.length).fill(null));

  const handleDrop = (answer, index) => {
    const newState = [...state];
    newState[index] = answer;
    setState(newState);
  };

  return (
    <p>
      {text.map((word, index) => (
        <span key={index}>
          {word === '?' ? <DropSpace expectedAnswer={correctText[index]} onDrop={(answer) => handleDrop(answer, index)} checkAnswers={checkAnswers} /> : word}
        </span>
      ))}
    </p>
  );
};

const CreateDuoLingo = ({ setCustomData, customData }) => {
  const [correctText, setCorrectText] = useState(customData?.correctText || ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']);
  const [answers, setAnswers] = useState(customData?.answers || ['quick', 'fox', 'jumps', 'lazy', 'dog']);
  const [text, setText] = useState(customData?.text || ['The', '?', 'brown', '?', '?', 'over', 'the', '?', '?']);

  useEffect(() => {
    setCorrectText(customData?.correctText || ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']);
    setAnswers(customData?.answers || ['quick', 'fox', 'jumps', 'lazy', 'dog']);
    setText(customData?.text || ['The', '?', 'brown', '?', '?', 'over', 'the', '?', '?']);
  }, [customData]);

  const saveExercise = async () => {
    const customData = {
      correctText: correctText,
      answers: answers,
      text: text
    };
    setCustomData(customData);
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Correct Text:</label>
        <input
          type="text"
          value={correctText.join(' ')}
          onChange={(e) => setCorrectText(e.target.value.split(' '))}
          placeholder="Enter the correct text"
          style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Answers:</label>
        <input
          type="text"
          value={answers.join(', ')}
          onChange={(e) => setAnswers(e.target.value.split(', '))}
          placeholder="Enter the answers"
          style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px' }}>Text with DropSpaces:</label>
        <input
          type="text"
          value={text.join(' ')}
          onChange={(e) => setText(e.target.value.split(' '))}
          placeholder="Enter the text with drop spaces"
          style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: '30px', alignSelf: 'center' }}
      />
  
    </div>
  );
};

export default CreateDuoLingo;
