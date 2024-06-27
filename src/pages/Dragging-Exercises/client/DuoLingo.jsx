import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  p: {
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  answerOptionMain: {
    display: 'inline-block',
    padding: '10px 20px',
    margin: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '5px',
    cursor: 'move',
  },
  dropSpace: {
    display: 'inline-block',
    width: '50px',
    height: '20px',
    border: '1px dashed #007BFF',
    margin: '0 5px',
  },
  checkButton: {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

const AnswerBlock = ({ answer }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'answer',
    item: { answer },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className='answer-option-main__div' ref={drag} style={{ ...styles.answerOptionMain, opacity: isDragging ? 0.5 : 1 }}>
      <h3>{answer}</h3>
    </div>
  );
};

const Paragraph = ({ text, correctText }) => {
  const [state, setState] = useState(Array(text.length).fill(null));

  const handleDrop = (answer, index) => {
    const newState = [...state];
    newState[index] = answer;
    setState(newState);
  };

  return (
    <p style={styles.p}>
      {text.map((word, index) => (
        <span key={index}>
          {word === '?' ? <DropSpace expectedAnswer={correctText[index]} onDrop={(answer) => handleDrop(answer, index)} /> : word}
        </span>
      ))}
    </p>
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
    <span className='drop-space' ref={drop} style={{ ...styles.dropSpace, backgroundColor: checkAnswers ? backgroundColor : 'transparent' }}>
      {droppedAnswer || ""}
    </span>
  );
};

const StudentApp = ({ text, answers = [], correctText }) => {
  // Map the answers before the return statement
  const answerBlocks = answers.map((answer, index) => (
    <AnswerBlock key={index} answer={answer.trim()} />
  ));

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Paragraph text={text} correctText={correctText} />
        {answerBlocks}
      </DndProvider>
    </div>  
  );
};





const DuoLingo = ({customData}) => {
  const text = customData?.text ?? '';
  const answers = customData?.answers ?? [];
  const correctText = customData?.correctText ?? '';
  const [checkAnswers, setCheckAnswers] = useState(false);
  
  return (
    <div style={styles.body}>
      <StudentApp text={text} answers={answers} correctText={correctText} />
      <button onClick={() => setCheckAnswers(true)} style={checkAnswers ? { ...styles.checkButton, backgroundColor: 'green' } : styles.checkButton}>
        Check Answers
      </button>
    </div>
  );
};

export default function CombinedApp() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DuoLingo />
    </DndProvider>
  );
}
