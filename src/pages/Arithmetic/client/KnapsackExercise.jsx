import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Item({ id, name, price }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { id, name, price },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const itemStyle = {
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'yellow',
        padding: '10px',
        margin: '5px',
        border: '1px solid black',
        boxShadow: '3px 3px 5px rgba(0,0,0,0.2)',
        cursor: 'grab',
        borderRadius: '5px'
    };

    return <div ref={drag} style={itemStyle}>{name} - €{parseFloat(price).toFixed(2)}</div>;
}

function Basket({ limitItems, limitMoney, onAdd, onUpdateTotal }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(''); 

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item, monitor) => {
      if (getTotalItemCount(items) < limitItems) {
        const newTotal = getTotalCost(items) + parseFloat(item.price);
        console.log(limitItems);
        console.log(limitMoney);
        console.log(getTotalItemCount(items));
        console.log(newTotal);
        if (newTotal <= limitMoney) {
          onAdd(item, items, setItems);
          setError(''); 
        } else {
          setError(`You cannot exceed the ${limitMoney} euro limit.`);
        }
      } else {
        setError(`You cannot exceed the limit of ${limitItems} elements in the basket.`);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [items, limitItems, limitMoney]);

  useEffect(() => {
    const total = getTotalCost(items);
    onUpdateTotal(total);
  }, [items, onUpdateTotal]);

  function getTotalItemCount(items) {
    return items.reduce((sum, item) => sum + item.count, 0);
  }

  function getTotalCost(items) {
    return items.reduce((sum, item) => sum + item.price * item.count, 0);
  }

  const isActive = canDrop && isOver;
  const backgroundColor = isActive ? '#f7f7f7' : '#f0f0f0';

  const basketStyle = {
    minHeight: '300px',
    width: '20%',
    backgroundColor: 'rgb(146, 211, 212)',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '50px auto 0 auto',
    padding: '20px',
    border: '2px solid black',
    boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',
  };

  return (
    <div ref={drop} style={basketStyle}>
      {items.map((item, index) => (
        <div key={index}>{item.name} - {item.count}</div>
      ))}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

function KnapsackExercise({ customData }) {
    const { items, itemsLimit, priceLimit, questionPrompt } = customData;
    const [total, setTotal] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');

    function handleAddItem(item, currentItems, setItems) {
        const index = currentItems.findIndex(i => i.id === item.id);
        if (index >= 0) {
            currentItems[index].count += 1;
        } else {
            currentItems.push({ ...item, count: 1 });
        }
        setItems([...currentItems]);
    }

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const checkAnswer = () => {
        if (parseFloat(userInput).toFixed(2) === total.toFixed(2)) {
            setResult('Correct!');
        } else {
            setResult('Incorrect, try again.');
        }
    };

    const totalStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50px'
    };

    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '30px'
    };

    const inputStyle = {
      padding: '12px 15px', // Increased padding for better touch interaction
      borderRadius: '8px', // Slightly more rounded corners
      marginBottom: '15px', // More space below the input
      width: '250px', // Wider input field for better readability
      border: '2px solid #007BFF', // Adding a border with a distinct color
      outline: 'none', // Removing the default focus outline
      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)', // Adding a shadow for depth
      transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', // Smooth transition for interaction effects
      ':focus': {
          borderColor: '#0056b3', // Darker border on focus
          boxShadow: '0 0 0 3px rgba(0,123,255,0.5)', // Expanding shadow effect on focus
          transform: 'scale(1.05)' // Slight enlargement on focus
      }
  };  

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <h2 style={{ textAlign: 'center' }}>{questionPrompt}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                    {items.map((item, index) => (
                        <Item key={index} id={index} name={item.name} price={item.price} />
                    ))}
                </div>
                <Basket limitItems={itemsLimit} limitMoney={priceLimit} onAdd={handleAddItem} onUpdateTotal={setTotal} />
                <div style={totalStyle}>
                    Total:
                    <input type="number" step="0.01" style={inputStyle} value={userInput} onChange={handleInputChange} />
                    <button style={buttonStyle} onClick={checkAnswer}>Check Answer</button>
                </div>
                {result && <div style={{ marginTop: '10px', textAlign: 'center' }}>{result}</div>}
            </div>
        </DndProvider>
    );
}

export default KnapsackExercise;
