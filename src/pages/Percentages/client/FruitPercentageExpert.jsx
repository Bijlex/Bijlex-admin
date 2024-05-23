import React, { useState, useEffect } from 'react';

export default function FruitPercentageExpert({ customData }) {
  const [applesCount, setApplesCount] = useState(generateRandomNumber());
  const [orangesCount, setOrangesCount] = useState(generateRandomNumber());
  const [basket1, setBasket1] = useState({ apples: [], oranges: [] });
  const [basket2, setBasket2] = useState({ apples: [], oranges: [] });
  const [basket3, setBasket3] = useState({ apples: [], oranges: [] });
  const [randomPercentageApples, setRandomPercentageApples] = useState({ basket1: '', basket2: '', basket3: '' });
  const [randomPercentageOranges, setRandomPercentageOranges] = useState({ basket1: '', basket2: '', basket3: '' });
  const [draggedFruits, setDraggedFruits] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const questionPrompt = customData?.questionPrompt || "No prompt provided";
  const [attempts, setAttempts] = useState(0);

  function generateRandomNumber() {
    return Math.floor(Math.random() * (12 - 5 + 1)) + 5;
  }

  function calculatePossiblePercentages(count) {
    const possiblePercentages = [];
    for (let i = 1; i <= count; i++) {
      for (let j = 1; j <= count - i; j++) {
        const basket1Percentage = ((i / count) * 100).toFixed(2);
        const basket2Percentage = ((j / count) * 100).toFixed(2);
        const basket3Percentage = (((count - i - j) / count) * 100).toFixed(2);
        possiblePercentages.push({ basket1: basket1Percentage, basket2: basket2Percentage, basket3: basket3Percentage });
      }
    }
    return possiblePercentages;
  }  

  useEffect(() => {
    const possiblePercentagesA = calculatePossiblePercentages(applesCount);
    const indexA = Math.floor(Math.random() * possiblePercentagesA.length);
    setRandomPercentageApples(possiblePercentagesA[indexA]);
    const possiblePercentagesO = calculatePossiblePercentages(orangesCount);
    const indexO = Math.floor(Math.random() * possiblePercentagesO.length);
    setRandomPercentageOranges(possiblePercentagesO[indexO]);
  }, []);

  const handleDrop = (e, basket) => {
    e.preventDefault();
    const fruitId = parseInt(e.dataTransfer.getData('fruitId'));
    const fruitType = e.dataTransfer.getData('fruitType');
    const newFruit = { type: fruitType, id: fruitId, basket: basket };
    setDraggedFruits(prevDraggedFruits => [...prevDraggedFruits, newFruit]);
    if (basket === 1) {
      setBasket1(prevBasket1 => ({
        ...prevBasket1,
        [fruitType]: [...prevBasket1[fruitType], fruitId]
      }));
      if (fruitType === 'apples') {
        setApplesCount(prevCount => prevCount - 1);
      } else if (fruitType === 'oranges') {
        setOrangesCount(prevCount => prevCount - 1);
      }
    } else if (basket === 2) {
      setBasket2(prevBasket2 => ({
        ...prevBasket2,
        [fruitType]: [...prevBasket2[fruitType], fruitId]
      }));
      if (fruitType === 'apples') {
        setApplesCount(prevCount => prevCount - 1);
      } else if (fruitType === 'oranges') {
        setOrangesCount(prevCount => prevCount - 1);
      }
    } else {
      setBasket3(prevBasket3 => ({
        ...prevBasket3,
        [fruitType]: [...prevBasket3[fruitType], fruitId]
      }));
      if (fruitType === 'apples') {
        setApplesCount(prevCount => prevCount - 1);
      } else if (fruitType === 'oranges') {
        setOrangesCount(prevCount => prevCount - 1);
      }
    }
  };  

  const handleSubmit = () => {
    setSubmitted(true);
    const totalApples = basket1.apples.length + basket2.apples.length + basket3.apples.length;
    const totalOranges = basket1.oranges.length + basket2.oranges.length + basket3.oranges.length;
    if (totalApples !== 0 || totalOranges !== 0) {
      const basket1PercentageApples = ((basket1.apples.length / totalApples) * 100).toFixed(2);
      const basket1PercentageOranges = ((basket1.oranges.length / totalOranges) * 100).toFixed(2);
      const basket2PercentageApples = ((basket2.apples.length / totalApples) * 100).toFixed(2);
      const basket2PercentageOranges = ((basket2.oranges.length / totalOranges) * 100).toFixed(2);
      const basket3PercentageApples = ((basket3.apples.length / totalApples) * 100).toFixed(2);
      const basket3PercentageOranges = ((basket3.oranges.length / totalOranges) * 100).toFixed(2);
      if (basket1PercentageApples === randomPercentageApples.basket1 && basket1PercentageOranges === randomPercentageOranges.basket1 && 
        basket2PercentageApples === randomPercentageApples.basket2 && basket2PercentageOranges === randomPercentageOranges.basket2 && 
        basket3PercentageApples === randomPercentageApples.basket3 && basket3PercentageOranges === randomPercentageOranges.basket3) {
        setCorrect(true);
      } else {
        setCorrect(false);
        setAttempts(attempts + 1);
      }
    }
  };
  

  const handleDragStart = (e, fruitType, index) => {
    e.dataTransfer.setData('fruitId', index);
    e.dataTransfer.setData('fruitType', fruitType);
  };

  const handleTryAgain = () => {
    setApplesCount(basket1.apples.length + basket2.apples.length);
    setOrangesCount(basket1.oranges.length + basket2.oranges.length);
    setBasket1({ apples: [], oranges: [] });
    setBasket2({ apples: [], oranges: [] });
    setBasket3({ apples: [], oranges: [] });
    setSubmitted(false);
    setCorrect(false);
    setDraggedFruits([]);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div className="fruits-count">
        <div>Apples left: {applesCount}</div>
        <div>Grapes left: {orangesCount}</div>
      </div>
      <div className="generated-percentage">
        <div>
          <div>Basket 1 - Apples: {randomPercentageApples.basket1}%</div>
          <div>Basket 1 - Grapes: {randomPercentageOranges.basket1}%</div>
        </div>
        <div>
          <div>Basket 2 - Apples: {randomPercentageApples.basket2}%</div>
          <div>Basket 2 - Grapes: {randomPercentageOranges.basket2}%</div>
        </div>
        <div>
          <div>Basket 3 - Apples: {randomPercentageApples.basket3}%</div>
          <div>Basket 3 - Grapes: {randomPercentageOranges.basket3}%</div>
        </div>
      </div>
      <div className="baskets">
        <div className="basket" onDrop={(e) => handleDrop(e, 1)} onDragOver={(e) => e.preventDefault()}>
          <div className="basket-label"></div>
          {draggedFruits.map((fruit, index) => (
            fruit.basket === 1 && (fruit.type === 'apples' || fruit.type === 'oranges') && <div key={index} className="dragged-fruit">{fruit.type === 'apples' ? '🍎' : '🍇'}</div>
          ))}
        </div>
        <div className="basket" onDrop={(e) => handleDrop(e, 2)} onDragOver={(e) => e.preventDefault()}>
          <div className="basket-label"></div>
          {draggedFruits.map((fruit, index) => (
            fruit.basket === 2 && (fruit.type === 'apples' || fruit.type === 'oranges') && <div key={index} className="dragged-fruit">{fruit.type === 'apples' ? '🍎' : '🍇'}</div>
          ))}
        </div>
        <div className="basket" onDrop={(e) => handleDrop(e, 3)} onDragOver={(e) => e.preventDefault()}>
          <div className="basket-label"></div>
          {draggedFruits.map((fruit, index) => (
            fruit.basket === 3 && (fruit.type === 'apples' || fruit.type === 'oranges') && <div key={index} className="dragged-fruit">{fruit.type === 'apples' ? '🍎' : '🍇'}</div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="result">
          {correct ? 'Correct!' : (
            <div>
                <div>Your Percentage for Basket 1 - Apples: {(basket1.apples.length / (basket1.apples.length + basket2.apples.length + basket3.apples.length) * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 1 - Grapes: {(basket1.oranges.length / (basket1.oranges.length + basket2.oranges.length + basket3.oranges.length) * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 2 - Apples: {(basket2.apples.length / (basket1.apples.length + basket2.apples.length + basket3.apples.length) * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 2 - Grapes: {(basket2.oranges.length / (basket1.oranges.length + basket2.oranges.length + basket3.oranges.length) * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 3 - Apples: {(basket3.apples.length / (basket1.apples.length + basket2.apples.length + basket3.apples.length) * 100).toFixed(2)}%</div>
                <div>Your Percentage for Basket 3 - Grapes: {(basket3.oranges.length / (basket1.oranges.length + basket2.oranges.length + basket3.oranges.length) * 100).toFixed(2)}%</div>
                {attempts < 2 && (
                    <button className="try-again-button" style={{marginLeft:"120px"}} onClick={handleTryAgain}>Retry</button>
                )}
              </div>
          )}
        </div>
      )}
      <div className="fruits">
        <div className="apples" onDrop={(e) => handleDrop(e, 1)} onDragOver={(e) => e.preventDefault()}>
          {Array.from({ length: applesCount }).map((_, index) => (
            <div
              key={index}
              className="apple"
              draggable
              onDragStart={(e) => handleDragStart(e, 'apples', index)}
            >🍎
            </div>
          ))}
        </div>
        <div className="oranges" onDrop={(e) => handleDrop(e, 2)} onDragOver={(e) => e.preventDefault()}>
          {Array.from({ length: orangesCount }).map((_, index) => (
            <div
              key={index}
              className="orange"
              draggable
              onDragStart={(e) => handleDragStart(e, 'oranges', index)}
            >🍇
            </div>
          ))}
        </div>
      </div>
      {(applesCount === 0 && orangesCount === 0) && (
        <button className="submit-button" onClick={handleSubmit}>
          Check answer
        </button>
      )}
      {attempts >= 2 && (
        <button className="try-again-button">Continue</button>
      )}
    </div>
  );
}

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