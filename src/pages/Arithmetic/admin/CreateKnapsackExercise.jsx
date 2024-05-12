import React, { useState } from 'react';
import SvgBtn from '../../../components/general/buttons/SvgBtn';
import { documentIcon } from "../../../constants/icons.jsx";

const CreateKnapsackExercise = ({ setCustomData }) => {
    const [questionPrompt, setQuestionPrompt] = useState('');
    const [items, setItems] = useState([
        { name: '', price: '' },
        { name: '', price: '' },
        { name: '', price: '' },
        { name: '', price: '' },
        { name: '', price: '' }
    ]);
    const [itemsLimit, setItemsLimit] = useState('');
    const [priceLimit, setPriceLimit] = useState('');

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt,
            items,
            itemsLimit,
            priceLimit
        };
        setCustomData(customData);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ marginBottom: '10px' }}>
                Question Prompt:
                <input
                    type="text"
                    value={questionPrompt}
                    onChange={(e) => setQuestionPrompt(e.target.value)}
                    placeholder="Enter your question prompt"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}
                />
            </label>
            {items.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <label style={{ marginRight: '10px' }}>
                        Item {index + 1} Name:
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            placeholder="Enter item name"
                            style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            placeholder="Enter item price"
                            style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </label>
                </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '20px 0' }}>
                <label style={{ marginRight: '10px' }}>
                    Number of Items Limit:
                    <input
                        type="number"
                        value={itemsLimit}
                        onChange={(e) => setItemsLimit(e.target.value)}
                        placeholder="Enter the limit on number of items"
                        style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </label>
                <label>
                    Price Limit:
                    <input
                        type="number"
                        value={priceLimit}
                        onChange={(e) => setPriceLimit(e.target.value)}
                        placeholder="Enter the price limit"
                        style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </label>
            </div>
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginBottom: '30px', alignSelf: 'center' }} // Center button, adjust margin if needed
            />
        </div>
    );
}

export default CreateKnapsackExercise;
