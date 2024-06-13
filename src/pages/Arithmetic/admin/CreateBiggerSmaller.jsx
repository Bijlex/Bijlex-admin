import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateBiggerSmaller({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [number1, setNumber1] = useState(customData?.number1 || "");
    const [number2, setNumber2] = useState(customData?.number2 || "");
    const [correctSign, setCorrectSign] = useState(customData?.correctSign || "");

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setNumber1(customData?.number1 || "");
        setNumber2(customData?.number2 || "");
        setCorrectSign(customData?.correctSign || "");
    }, [customData]);

    const saveExercise = async () => {
        const newCustomData = {
            questionPrompt: questionPrompt,
            number1: number1,
            number2: number2,
            correctSign: correctSign,
        }
        setCustomData(newCustomData);
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <label style={{ marginBottom: '5px' }}>Number 1:</label>
                <input
                    type="text"
                    value={number1}
                    onChange={(e) => setNumber1(e.target.value)}
                    placeholder="Enter number 1"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Number 2:</label>
                <input
                    type="text"
                    value={number2}
                    onChange={(e) => setNumber2(e.target.value)}
                    placeholder="Enter number 2"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Correct Sign:</label>
                <input
                    type="text"
                    value={correctSign}
                    onChange={(e) => setCorrectSign(e.target.value)}
                    placeholder="Enter the correct sign"
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

export default CreateBiggerSmaller;
