import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateTrueStatements({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [numberOfFields, setNumberOfFields] = useState(3);
    const [inputValues, setInputValues] = useState(Array(numberOfFields).fill(''));
    const [truthValues, setTruthValues] = useState(Array(numberOfFields).fill(''));

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setInputValues(customData?.inputValues || Array(numberOfFields).fill(''));
        setTruthValues(customData?.truthValues || Array(numberOfFields).fill(''));
    }, [customData, numberOfFields]);

    const handleNumberOfFieldsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumberOfFields(value);
    };

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleTruthValueChange = (index, value) => {
        const newTruthValues = [...truthValues];
        newTruthValues[index] = value;
        setTruthValues(newTruthValues);
    };

    const saveExercise = () => {
        const customData = {
            questionPrompt: questionPrompt,
            inputValues: inputValues,
            truthValues: truthValues
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
                If you want to select true, first select false, then true.
                {[...Array(numberOfFields)].map((_, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <label>Input {index + 1}:</label>
                        <input
                            type="text"
                            value={inputValues[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="Enter a statement"
                            style={{ marginLeft: '10px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <select
                            value={truthValues[index]}
                            onChange={(e) => handleTruthValueChange(index, e.target.value)}
                            style={{ marginLeft: '10px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
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

export default CreateTrueStatements;
