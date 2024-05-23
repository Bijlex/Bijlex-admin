import React, { useState, useEffect } from 'react';

function FruitPercentageBasic({ customData }) {
  const [applesCount, setApplesCount] = useState(generateRandomNumber());
  const [basket1Apples, setBasket1Apples] = useState([]);
  const [basket2Apples, setBasket2Apples] = useState([]);
  const [randomPercentage, setRandomPercentage] = useState({ basket1: '', basket2: '' });
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const questionPrompt = customData?.questionPrompt || "No prompt provided";
  const [attempts, setAttempts] = useState(0);

  function generateRandomNumber() {
    return Math.floor(Math.random() * (12 - 5 + 1)) + 5;
  }

  function calculatePossiblePercentages() {
    const possiblePercentages = [];
    for (let i = 1; i <= applesCount; i++) {
      const basket1Percentage = ((i / applesCount) * 100).toFixed(2);
      const basket2Percentage = (((applesCount - i) / applesCount) * 100).toFixed(2);
      possiblePercentages.push({ basket1: basket1Percentage, basket2: basket2Percentage });
    }
    return possiblePercentages;
  }

  useEffect(() => {
    const possiblePercentages = calculatePossiblePercentages();
    const index = Math.floor(Math.random() * possiblePercentages.length);
    setRandomPercentage(possiblePercentages[index]);
  }, []);

  const handleDrop = (e, basket) => {
    e.preventDefault();
    const appleId = e.dataTransfer.getData('appleId');
    if (basket === 1) {
      setBasket1Apples([...basket1Apples, appleId]);
    } else {
      setBasket2Apples([...basket2Apples, appleId]);
    }
    setApplesCount(applesCount - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (basket1Apples.length !== 0 || basket2Apples.length !== 0) {
      const basket1Percentage = ((basket1Apples.length / (basket1Apples.length + basket2Apples.length)) * 100).toFixed(2);
      const basket2Percentage = ((basket2Apples.length / (basket1Apples.length + basket2Apples.length)) * 100).toFixed(2);
      if (basket1Percentage === randomPercentage.basket1 && basket2Percentage === randomPercentage.basket2) {
        setCorrect(true);
      } else {
        setCorrect(false);
        setAttempts(attempts + 1);
      }
    }
  };

  const handleTryAgain = () => {
    setApplesCount(basket1Apples.length + basket2Apples.length);
    setBasket1Apples([]);
    setBasket2Apples([]);
    setSubmitted(false);
    setCorrect(false);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div className="apples-count">Apples left: {applesCount}</div>
      <div className="generated-percentage">
        <div>Basket 1: {randomPercentage.basket1}%</div>
        <div>Basket 2: {randomPercentage.basket2}%</div>
      </div>
      <div className="baskets">
        <div className="basket" onDrop={(e) => handleDrop(e, 1)} onDragOver={(e) => e.preventDefault()}>
          {basket1Apples.map((appleId) => (
            <div key={appleId} className="apple">
              🍎
            </div>
          ))}
        </div>
        <div className="basket" onDrop={(e) => handleDrop(e, 2)} onDragOver={(e) => e.preventDefault()}>
          {basket2Apples.map((appleId) => (
            <div key={appleId} className="apple">
              🍎
            </div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="result">
          {correct ? 'Correct!' : (
            <div>
              <div>Your Percentage for Basket 1: {(basket1Apples.length / (basket1Apples.length + basket2Apples.length) * 100).toFixed(2)}%</div>
              <div>Your Percentage for Basket 2: {(basket2Apples.length / (basket1Apples.length + basket2Apples.length) * 100).toFixed(2)}%</div>
              {attempts < 2 && (
                <button className="try-again-button" style={{marginLeft:"80px"}} onClick={handleTryAgain}>Retry</button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="apples">
        {Array.from({ length: applesCount }).map((_, index) => (
          <div key={index} className="apple" draggable onDragStart={(e) => e.dataTransfer.setData('appleId', index)}>
            🍎
          </div>
        ))}
      </div>
      {applesCount === 0 ? <button className="submit-button" onClick={handleSubmit}>Check answer</button> : ''}
      {attempts >= 2 && (
        <button className="try-again-button">Continue</button>
      )}
    </div>
  );
}

export default FruitPercentageBasic;

// CSS Styles
const styles = `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.apples-count {
  margin-top: 20px;
  margin-bottom: 20px;
}

.generated-percentage {
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin-bottom: 10px;
  margin-top: 20px;
}

.baskets {
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin-bottom: 40px;
}

.basket {
  width: 280px;
  height: 190px;
  background-color: transparent;
  border: 3px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.apples {
  display: flex;
  justify-content: center;
}

.apple {
  font-size: 24px;
  margin-right: 5px;
  cursor: pointer;
}

.level-button, .submit-button, .try-again-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #10b3cf;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 40px;
}  

.level-button, .submit-button {
  margin-bottom: 40px;
}

.level-button:hover, .submit-button:hover, .try-again-button:hover {
  background-color: #002ead;
  transition: 0.7s;
}

.basket .dragged-fruit {
  font-size: 24px; 
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);