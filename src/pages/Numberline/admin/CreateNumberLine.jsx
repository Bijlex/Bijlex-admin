import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateNumberLines({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(
        customData?.questionPrompt || ""
    );
    const [numberOfFields, setNumberOfFields] = useState(3);
    const [inputValues, setInputValues] = useState(Array(numberOfFields).fill(''));

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
    }, [customData]);

    useEffect(() => {
        setInputValues(Array(numberOfFields).fill(''));
    }, [numberOfFields]);

    const handleNumberOfFieldsChange = (e) => {
        setNumberOfFields(parseInt(e.target.value, 10));
    };

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt: questionPrompt,
            inputValues: inputValues
        }
        setCustomData(customData);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Question Prompt:</label>
                <input
                    type="text"
                    value={questionPrompt}
                    onChange={(e) => setQuestionPrompt(e.target.value)}
                    placeholder="Enter the question prompt"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Number of Inputs:</label>
                <div>
                    {[...Array(8)].map((_, index) => {
                        const value = index + 3;
                        return (
                            <label key={value} style={{ margin: '0 10px' }}>
                                <input
                                    type="radio"
                                    value={value}
                                    checked={numberOfFields === value}
                                    onChange={handleNumberOfFieldsChange}
                                />
                                {value}
                            </label>
                        );
                    })}
                </div>
            </div>

            <div>
                {inputValues.map((value, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <label>Input {index + 1}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="Enter a value (integer, decimal, or fraction)"
                            style={{ marginLeft: '10px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                ))}
            </div>

            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginTop: '30px', alignSelf: 'center' }} 
            />
        </div>
    );
}

export default CreateNumberLines;
