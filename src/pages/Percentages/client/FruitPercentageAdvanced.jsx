import React, { useState, useEffect } from 'react';

function FruitPercentageAdvanced({ customData }) {
  const [applesCount, setApplesCount] = useState(generateRandomNumber());
  const [orangesCount, setOrangesCount] = useState(generateRandomNumber());
  const [initialApplesCount, setInitialApplesCount] = useState(applesCount);
  const [initialOrangesCount, setInitialOrangesCount] = useState(orangesCount);
  const [basket1, setBasket1] = useState({ apples: [], oranges: [] });
  const [basket2, setBasket2] = useState({ apples: [], oranges: [] });
  const [allApples, setAllApples] = useState(Array.from({ length: applesCount }, (_, index) => `apple-${index}`));
  const [allOranges, setAllOranges] = useState(Array.from({ length: orangesCount }, (_, index) => `orange-${index}`));
  const [randomPercentageApples, setRandomPercentageApples] = useState({ basket1: '', basket2: '' });
  const [randomPercentageOranges, setRandomPercentageOranges] = useState({ basket1: '', basket2: '' });
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
      const basket1Percentage = ((i / count) * 100).toFixed(2);
      const basket2Percentage = (((count - i) / count) * 100).toFixed(2);
      possiblePercentages.push({ basket1: basket1Percentage, basket2: basket2Percentage });
    }
    return possiblePercentages;
  }

  useEffect(() => {
    const possiblePercentagesA = calculatePossiblePercentages(initialApplesCount);
    const indexA = Math.floor(Math.random() * possiblePercentagesA.length);
    setRandomPercentageApples(possiblePercentagesA[indexA]);
    const possiblePercentagesO = calculatePossiblePercentages(initialOrangesCount);
    const indexO = Math.floor(Math.random() * possiblePercentagesO.length);
    setRandomPercentageOranges(possiblePercentagesO[indexO]);
  }, [initialApplesCount, initialOrangesCount]);

  const handleDrop = (e, basket) => {
    e.preventDefault();
    const fruitId = e.dataTransfer.getData('fruitId');
    const fruitType = e.dataTransfer.getData('fruitType');
    const fromBasket = e.dataTransfer.getData('fromBasket');

    if (basket === 1) {
      if (fromBasket === "basket2") {
        setBasket2(prev => ({ ...prev, [fruitType]: prev[fruitType].filter(id => id !== fruitId) }));
      } else {
        if (fruitType === 'apples') {
          setAllApples(prev => prev.filter(id => id !== fruitId));
        } else if (fruitType === 'oranges') {
          setAllOranges(prev => prev.filter(id => id !== fruitId));
        }
      }
      setBasket1(prev => ({ ...prev, [fruitType]: [...prev[fruitType], fruitId] }));
    } else if (basket === 2) {
      if (fromBasket === "basket1") {
        setBasket1(prev => ({ ...prev, [fruitType]: prev[fruitType].filter(id => id !== fruitId) }));
      } else {
        if (fruitType === 'apples') {
          setAllApples(prev => prev.filter(id => id !== fruitId));
        } else if (fruitType === 'oranges') {
          setAllOranges(prev => prev.filter(id => id !== fruitId));
        }
      }
      setBasket2(prev => ({ ...prev, [fruitType]: [...prev[fruitType], fruitId] }));
    } else if (basket === 'original') {
      if (fromBasket === "basket1") {
        setBasket1(prev => ({ ...prev, [fruitType]: prev[fruitType].filter(id => id !== fruitId) }));
      } else if (fromBasket === "basket2") {
        setBasket2(prev => ({ ...prev, [fruitType]: prev[fruitType].filter(id => id !== fruitId) }));
      }
      if (fruitType === 'apples') {
        setAllApples(prev => [...prev, fruitId]);
      } else if (fruitType === 'oranges') {
        setAllOranges(prev => [...prev, fruitId]);
      }
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const basket1PercentageApples = ((basket1.apples.length / initialApplesCount) * 100).toFixed(2);
    const basket1PercentageOranges = ((basket1.oranges.length / initialOrangesCount) * 100).toFixed(2);
    const basket2PercentageApples = ((basket2.apples.length / initialApplesCount) * 100).toFixed(2);
    const basket2PercentageOranges = ((basket2.oranges.length / initialOrangesCount) * 100).toFixed(2);

    if (
      basket1PercentageApples === randomPercentageApples.basket1 &&
      basket1PercentageOranges === randomPercentageOranges.basket1 &&
      basket2PercentageApples === randomPercentageApples.basket2 &&
      basket2PercentageOranges === randomPercentageOranges.basket2
    ) {
      setCorrect(true);
    } else {
      setCorrect(false);
      setAttempts(attempts + 1);
    }
  };

  const handleTryAgain = () => {
    setApplesCount(initialApplesCount);
    setOrangesCount(initialOrangesCount);
    setBasket1({ apples: [], oranges: [] });
    setBasket2({ apples: [], oranges: [] });
    setAllApples(Array.from({ length: initialApplesCount }, (_, index) => `apple-${index}`));
    setAllOranges(Array.from({ length: initialOrangesCount }, (_, index) => `orange-${index}`));
    setSubmitted(false);
    setCorrect(false);
  };

  const handleDragStart = (e, fruitType, index, fromBasket) => {
    e.dataTransfer.setData('fruitId', index);
    e.dataTransfer.setData('fruitType', fruitType);
    e.dataTransfer.setData('fromBasket', fromBasket);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
      <div className="fruits-count">
        <div>Apples left: {allApples.length}</div>
        <div>Grapes left: {allOranges.length}</div>
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
      </div>
      <div className="baskets">
        <div className="basket" onDrop={(e) => handleDrop(e, 1)} onDragOver={(e) => e.preventDefault()}>
          <div className="basket-label"></div>
          {basket1.apples.map((fruitId, index) => (
            <div key={index} className="apple" draggable onDragStart={(e) => handleDragStart(e, 'apples', fruitId, 'basket1')}>
              🍎
            </div>
          ))}
          {basket1.oranges.map((fruitId, index) => (
            <div key={index} className="orange" draggable onDragStart={(e) => handleDragStart(e, 'oranges', fruitId, 'basket1')}>
              🍇
            </div>
          ))}
        </div>
        <div className="basket" onDrop={(e) => handleDrop(e, 2)} onDragOver={(e) => e.preventDefault()}>
          <div className="basket-label"></div>
          {basket2.apples.map((fruitId, index) => (
            <div key={index} className="apple" draggable onDragStart={(e) => handleDragStart(e, 'apples', fruitId, 'basket2')}>
              🍎
            </div>
          ))}
          {basket2.oranges.map((fruitId, index) => (
            <div key={index} className="orange" draggable onDragStart={(e) => handleDragStart(e, 'oranges', fruitId, 'basket2')}>
              🍇
            </div>
          ))}
        </div>
        </div>
      <div className="original">
        <div className="apples" onDrop={(e) => handleDrop(e, 'original')} onDragOver={(e) => e.preventDefault()}>
          {allApples.map((fruitId, index) => (
            <div key={index} className="apple" draggable onDragStart={(e) => handleDragStart(e, 'apples', fruitId, 'original')}>
              🍎
            </div>
          ))}
        </div>
        <div className="oranges" onDrop={(e) => handleDrop(e, 'original')} onDragOver={(e) => e.preventDefault()}>
          {allOranges.map((fruitId, index) => (
            <div key={index} className="orange" draggable onDragStart={(e) => handleDragStart(e, 'oranges', fruitId, 'original')}>
              🍇
            </div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="result">
          {correct ? (
            <div>
              <h3>Correct!</h3>
              <button className="try-again-button" onClick={handleTryAgain}>Next Question</button>
            </div>
          ) : (
            <div>
              <h3>Incorrect</h3>
              <p style={{ color: 'black' }}>Your Percentage for Basket 1 - Apples: {(basket1.apples.length / initialApplesCount * 100).toFixed(2)}%</p>
              <p style={{ color: 'black' }}>Your Percentage for Basket 1 - Grapes: {(basket1.oranges.length / initialOrangesCount * 100).toFixed(2)}%</p>
              <p style={{ color: 'black' }}>Your Percentage for Basket 2 - Apples: {(basket2.apples.length / initialApplesCount * 100).toFixed(2)}%</p>
              <p style={{ color: 'black' }}>Your Percentage for Basket 2 - Grapes: {(basket2.oranges.length / initialOrangesCount * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      )}
      {allApples.length === 0 && allOranges.length === 0 && (
        <button className="submit-button" onClick={handleSubmit}>Check Answer</button>
      )}
      {attempts < 2 && (
        <button className="try-again-button" onClick={handleTryAgain}>Try Again</button>
      )}
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .fruits-count {
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

          .basket-label {
            font-weight: bold;
            margin-bottom: 10px;
          }

          .original {
            margin-top: 40px;
          }

          .original h3 {
            margin-bottom: 10px;
          }

          .apples, .oranges {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          .apple, .orange {
            font-size: 24px;
            margin-right: 5px;
            margin-bottom: 5px;
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
        `}
      </style>
    </div>
  );
}

export default FruitPercentageAdvanced;
