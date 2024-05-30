import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Item({ id, name, price, isBasketItem, count, onRemove }) {
  const [{ isDragging }, drag] = useDrag(() => ({
      type: 'ITEM',
      item: { id, name, price, isBasketItem },
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

  return (
      <div ref={drag} style={itemStyle}>
          {name} - €{parseFloat(price).toFixed(2)}
          {isBasketItem && (
            <>
              - {count} 
              <button
                  onClick={() => onRemove(id)}
                  style={{
                      marginLeft: '5px',
                      padding: '2px 3px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                  }}
              >
                  Remove
              </button>
              </>
          )}
      </div>
  );
}

function Basket({ limitItems, limitMoney, onAdd, onUpdateTotal }) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item) => {
            if (item.isBasketItem) {
                // Removing the item from the basket when dragged outside
                const updatedItems = items.filter((basketItem) => basketItem.id !== item.id);
                setItems(updatedItems);
                const total = getTotalCost(updatedItems);
                onUpdateTotal(total);
            } else {
                if (getTotalItemCount(items) < limitItems) {
                    const newTotal = getTotalCost(items) + parseFloat(item.price);
                    if (newTotal <= limitMoney) {
                        onAdd(item, items, setItems);
                        setError('');
                    } else {
                        setError(`You cannot exceed the ${limitMoney} euro limit.`);
                    }
                } else {
                    setError(`You cannot exceed the limit of ${limitItems} elements in the basket.`);
                }
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
        width: '30%',
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
                <Item key={index} id={item.id} name={item.name} price={item.price} isBasketItem={true} count={item.count} onRemove={removeItem} />
            ))}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );

    function removeItem(itemId) {
      const updatedItems = items.map((item) => {
          if (item.id === itemId) {
              return { ...item, count: item.count - 1 }; // Decrease the count of the item by 1
          }
          return item;
      }).filter((item) => item.count > 0); // Remove items with count 0
      setItems(updatedItems);
      const total = getTotalCost(updatedItems);
      onUpdateTotal(total);
  }
  
}

function KnapsackExercise({ customData }) {
    const { items, itemsLimit, priceLimit, questionPrompt } = customData;
    const [total, setTotal] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');

    function handleAddItem(item, currentItems, setItems) {
      const index = currentItems.findIndex((i) => i.id === item.id);
      if (index >= 0) {
          currentItems[index].count += 1;
      } else {
          currentItems.push({ ...item, count: 1 }); // Set the count property
      }
      setItems([...currentItems]);
  }  

    const handleRemoveItem = (itemId, currentItems, setItems) => {
        const updatedItems = currentItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, count: item.count - 1 }; // Decreasing the count of the item
            }
            return item;
        }).filter((item) => item.count > 0); // Filtering out items with count 0
        setItems(updatedItems);
    };

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
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        width: '250px',
        border: '2px solid #007BFF',
        outline: 'none',
        boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <h2 style={{ textAlign: 'center' }}>{questionPrompt}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                    {items.map((item, index) => (
                        <Item key={index} id={index} name={item.name} price={item.price} isBasketItem={false} />
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
