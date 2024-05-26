import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreatePieChartStory({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [totalOfItems, setTotalOfItems] = useState(customData?.totalOfItems || 0);
    const [numberOfItems, setNumberOfItems] = useState(customData?.numberOfItems || 0);
    const [items, setItems] = useState(customData?.items || []);
    const [generateItems, setGenerateItems] = useState(false);

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setTotalOfItems(customData?.totalOfItems || 0);
        setNumberOfItems(customData?.numberOfItems || 0);
        setItems(customData?.items || []);
        setGenerateItems(false);
    }, [customData]);

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const handleTotalOfItemsChange = (event) => {
        setTotalOfItems(parseInt(event.target.value, 10) || 0);
    };

    const handleNumberOfItemsChange = (event) => {
        setNumberOfItems(parseInt(event.target.value, 10) || 0);
    };

    const handleGenerateItems = () => {
        const newItems = Array.from({ length: numberOfItems }, () => ({ name: "", number: "" }));
        setItems(newItems);
        setGenerateItems(true);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt,
            totalOfItems,
            numberOfItems,
            items
        };
        setCustomData(customData);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Question Prompt:</label>
                <input
                    type="text"
                    value={questionPrompt}
                    onChange={handleQuestionPromptChange}
                    placeholder="Enter the question prompt"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ marginRight: '10px' }}>Total of Items:</label>
                <input
                    type="number"
                    value={totalOfItems}
                    onChange={handleTotalOfItemsChange}
                    placeholder="Enter the total number of items"
                    style={{ width: '100px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ marginRight: '10px' }}>Number of Items:</label>
                <input
                    type="number"
                    value={numberOfItems}
                    onChange={handleNumberOfItemsChange}
                    placeholder="Enter the number of items"
                    style={{ width: '100px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
                />
                <button
                    onClick={handleGenerateItems}
                    style={{ padding: '8px 16px', fontSize: '16px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
                >
                    Generate Items
                </button>
            </div>
            {generateItems && items.map((item, index) => (
                <div key={index} style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ marginRight: '10px' }}>{`Item ${index + 1} Name:`}</label>
                    <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder={`Enter name for item ${index + 1}`}
                        style={{ width: '200px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
                    />
                    <label style={{ marginRight: '10px' }}>{`Item ${index + 1} Number:`}</label>
                    <input
                        type="number"
                        value={item.number}
                        onChange={(e) => handleItemChange(index, "number", e.target.value)}
                        placeholder={`Enter number for item ${index + 1}`}
                        style={{ width: '100px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
            ))}
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginBottom: '30px', alignSelf: 'center' }} 
            />
        </div>
    );
}

export default CreatePieChartStory;
