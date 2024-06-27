import React, { useState, useRef, useEffect } from 'react';
import styles from "../../../styles/train/Train.module.css";

function TrainExercise({ customData }) {
  const [number, setNumber] = useState(customData?.inputNumber || null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [trainMoving, setTrainMoving] = useState(false);
  const [key, setKey] = useState(0); 
  const responseTimeoutRef = useRef(null); 
  const [respondedInTime, setRespondedInTime] = useState(true);
  const [message, setMessage] = useState('');

  const { inputNumber, operations } = customData;

  const startTrain = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setMessage('');  
    setRespondedInTime(true);
    setTrainMoving(false);
  
    clearTimeout(responseTimeoutRef.current);
  
    setTimeout(() => {
      setTrainMoving(true);
      responseTimeoutRef.current = setTimeout(() => {
        if (message === '') {
          setRespondedInTime(false);
          setMessage('You did not answer in time'); 
        }
      }, 10000);
    }, 10);
  
    setKey(prevKey => prevKey + 1);
  };
  
  const checkAnswer = () => {
    const computedValue = computeValue(number);
    const isCorrect = parseInt(userAnswer, 10) === computedValue;
    setIsCorrect(isCorrect);
    setMessage(isCorrect ? "Juist!" : "Fout, probeer opnieuw.");  
  };  
  
  useEffect(() => {
    return () => {
      clearTimeout(responseTimeoutRef.current); 
    };
  }, []);

  useEffect(() => {
    if (userAnswer !== '') {
        clearTimeout(responseTimeoutRef.current);
        setRespondedInTime(true);  
    }
  }, [userAnswer]);  

  const computeValue = (initialValue) => {
    let value = parseFloat(initialValue);
    operations.forEach(op => {
      if (op.startsWith('*')) {
        value *= parseFloat(op.slice(1));
      } else if (op.startsWith('/')) {
        value /= parseFloat(op.slice(1));
      } else if (op.startsWith('+')) {
        value += parseFloat(op.slice(1));
      } else if (op.startsWith('-')) {
        value -= parseFloat(op.slice(1));
      }
    });
    return value;
  };

  const handleChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const Train = ({ moving }) => (
    <section className={styles.stage}>
      <div className={`${styles.train} ${moving ? styles.moveTrain : ''}`}>
        <div className={styles.wagon}><span>{operations[0]}</span></div>
        <div className={styles.wagon}><span>{operations[1]}</span></div>
        <div className={styles.wagon}><span>{operations[2]}</span></div>
        <div className={styles.wagon}><span>{operations[3]}</span></div>
        <div className={styles.locomotive}>
          <div className={styles.cabin}></div>
          <div className={styles.motor}></div>
        </div>
      </div>
    </section>
  );

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: '30px', color: 'black' }}>{customData?.questionPrompt || "No question prompt provided"}</h2>
      <button onClick={startTrain}>Begin met oefenen</button>
      <h2>Gegenereerd nummer: {number !== null ? number : 'Geen'}</h2>
      <input
        type="number"
        value={userAnswer}
        onChange={handleChange}
        placeholder="Voer uw antwoord in"
      />
      <button style={{marginTop:'40px'}} onClick={checkAnswer}>Antwoord nakijken</button>
      <div className={`${styles.messageContainer} ${message ? styles.visible : ''}`}>
        <p>{message}</p>
      </div>
      <Train moving={trainMoving} key={key} />
    </div>
  );
}

export default TrainExercise;
