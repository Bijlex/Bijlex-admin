import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateTrainExercise({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(
        customData?.questionPrompt || ""
    );
    const [inputNumber, setInputNumber] = useState(
        customData?.inputNumber || ""
    );
    const [operations, setOperations] = useState([
        customData?.operations?.[0] || "", // operation 1
        customData?.operations?.[1] || "", // operation 2
        customData?.operations?.[2] || "", // operation 3
        customData?.operations?.[3] || "", // operation 4
    ]);

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setInputNumber(customData?.inputNumber || "");
        setOperations([
            customData?.operations?.[0] || "", // operation 1
            customData?.operations?.[1] || "", // operation 2
            customData?.operations?.[2] || "", // operation 3
            customData?.operations?.[3] || "", // operation 4
        ]);
    }, [customData]);

    const saveExercise = async () => {
        const exerciseData = {
            questionPrompt: questionPrompt,
            inputNumber: inputNumber,
            operations: operations
        };
        setCustomData(exerciseData);
    };

    const handleOperationChange = (index, value) => {
        const newOperations = [...operations];
        newOperations[index] = value;
        setOperations(newOperations);
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
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Input Number:</label>
                <input
                    type="text"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                    placeholder="Enter the input number"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Operations:</label>
                <input
                    type="text"
                    value={operations[0]}
                    onChange={(e) => handleOperationChange(0, e.target.value)}
                    placeholder="Operation 1 (e.g., *10)"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    value={operations[1]}
                    onChange={(e) => handleOperationChange(1, e.target.value)}
                    placeholder="Operation 2 (e.g., /2)"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    value={operations[2]}
                    onChange={(e) => handleOperationChange(2, e.target.value)}
                    placeholder="Operation 3 (e.g., +5)"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    value={operations[3]}
                    onChange={(e) => handleOperationChange(3, e.target.value)}
                    placeholder="Operation 4 (e.g., -3)"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginBottom: '30px', alignSelf: 'center' }} 
            />
        </div>
    );
}

export default CreateTrainExercise;
