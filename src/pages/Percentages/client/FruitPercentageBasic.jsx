import React, { useState, useEffect } from 'react';

function FruitPercentageBasic({ customData }) {
  const [applesCount, setApplesCount] = useState(generateRandomNumber());
  const [initialApplesCount, setInitialApplesCount] = useState(applesCount);
  const [basket1Apples, setBasket1Apples] = useState([]);
  const [basket2Apples, setBasket2Apples] = useState([]);
  const [allApples, setAllApples] = useState(Array.from({ length: applesCount }, (_, index) => index.toString()));
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
    for (let i = 1; i <= initialApplesCount; i++) {
      const basket1Percentage = ((i / initialApplesCount) * 100).toFixed(2);
      const basket2Percentage = (((initialApplesCount - i) / initialApplesCount) * 100).toFixed(2);
      possiblePercentages.push({ basket1: basket1Percentage, basket2: basket2Percentage });
    }
    return possiblePercentages;
  }

  useEffect(() => {
    const possiblePercentages = calculatePossiblePercentages();
    const index = Math.floor(Math.random() * possiblePercentages.length);
    setRandomPercentage(possiblePercentages[index]);
  }, [initialApplesCount]);

  const handleDrop = (e, basket) => {
    e.preventDefault();
    const appleId = e.dataTransfer.getData('appleId');
    const fromBasket = e.dataTransfer.getData('fromBasket');

    if (basket === 1) {
      if (fromBasket === "basket2") {
        setBasket2Apples(basket2Apples.filter(id => id !== appleId));
      } else {
        setAllApples(allApples.filter(id => id !== appleId));
      }
      setBasket1Apples([...basket1Apples, appleId]);
    } else if (basket === 2) {
      if (fromBasket === "basket1") {
        setBasket1Apples(basket1Apples.filter(id => id !== appleId));
      } else {
        setAllApples(allApples.filter(id => id !== appleId));
      }
      setBasket2Apples([...basket2Apples, appleId]);
    } else if (basket === 'original') {
      if (fromBasket === "basket1") {
        setBasket1Apples(basket1Apples.filter(id => id !== appleId));
      } else if (fromBasket === "basket2") {
        setBasket2Apples(basket2Apples.filter(id => id !== appleId));
      }
      setAllApples([...allApples, appleId]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (basket1Apples.length !== 0 || basket2Apples.length !== 0) {
      const basket1Percentage = ((basket1Apples.length / initialApplesCount) * 100).toFixed(2);
      const basket2Percentage = ((basket2Apples.length / initialApplesCount) * 100).toFixed(2);
      if (basket1Percentage === randomPercentage.basket1 && basket2Percentage === randomPercentage.basket2) {
        setCorrect(true);
      } else {
        setCorrect(false);
        setAttempts(attempts + 1);
      }
    }
  };

  const handleTryAgain = () => {
    setApplesCount(initialApplesCount);
    setBasket1Apples([]);
    setBasket2Apples([]);
    setAllApples(Array.from({ length: initialApplesCount }, (_, index) => index.toString()));
    setSubmitted(false);
    setCorrect(false);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div className="apples-count">Apples left: {allApples.length}</div>
      <div className="generated-percentage">
        <div>Basket 1: {randomPercentage.basket1}%</div>
        <div>Basket 2: {randomPercentage.basket2}%</div>
      </div>
      <div className="baskets">
        <div className="basket" onDrop={(e) => handleDrop(e, 1)} onDragOver={(e) => e.preventDefault()}>
          {basket1Apples.map((appleId) => (
            <div key={appleId} className="apple" draggable onDragStart={(e) => {e.dataTransfer.setData('appleId', appleId); e.dataTransfer.setData('fromBasket', 'basket1');}}>
              🍎
            </div>
          ))}
        </div>
        <div className="basket" onDrop={(e) => handleDrop(e, 2)} onDragOver={(e) => e.preventDefault()}>
          {basket2Apples.map((appleId) => (
            <div key={appleId} className="apple" draggable onDragStart={(e) => {e.dataTransfer.setData('appleId', appleId); e.dataTransfer.setData('fromBasket', 'basket2');}}>
              🍎
            </div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="result">
        {correct ? (
          <div className="correct-message">Correct!</div>
            ) : (
              <div className="incorrect-message">
                <div style={{ display: 'flex', justifyContent: 'center' }}>Incorrect</div>
                <div>Your Percentage for Basket 1: {(basket1Apples.length / initialApplesCount * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 2: {(basket2Apples.length / initialApplesCount * 100).toFixed(2)}%</div>
                {attempts < 2 && (
                  <button className="try-again-button" onClick={handleTryAgain}>Retry</button>
                )}
              </div>
            )}
          </div>
      )}
      <div className="apples" onDrop={(e) => handleDrop(e, 'original')} onDragOver={(e) => e.preventDefault()}>
        {allApples.map((appleId) => (
          <div key={appleId} className="apple" draggable onDragStart={(e) => {e.dataTransfer.setData('appleId', appleId); e.dataTransfer.setData('fromBasket', 'original');}}>
            🍎
          </div>
        ))}
      </div>
      {allApples.length === 0 ? <button className="submit-button" onClick={handleSubmit}>Check answer</button> : ''}
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
  flex-wrap: wrap; /* Added to allow multiple rows */
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

.correct-message {
  color: green;
  font-size: 20px;
  margin-top: 10px;
}

.incorrect-message {
  color: red;
  font-size: 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
