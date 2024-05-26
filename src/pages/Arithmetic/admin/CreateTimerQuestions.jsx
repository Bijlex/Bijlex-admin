import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateTimerQuestions({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [arithmeticQuestion, setArithmeticQuestion] = useState(customData?.arithmeticQuestion || "");
    const [finalAnswer, setFinalAnswer] = useState(customData?.finalAnswer || "");
    const [timer, setTimer] = useState(customData?.timer || "");

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setArithmeticQuestion(customData?.arithmeticQuestion || "");
        setFinalAnswer(customData?.finalAnswer || "");
        setTimer(customData?.timer || "");
    }, [customData]);

    const saveExercise = async () => {
        const customData = {
            questionPrompt: questionPrompt,
            arithmeticQuestion: arithmeticQuestion,
            finalAnswer: finalAnswer,
            timer: timer
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
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Arithmetic Question:</label>
                <input
                    type="text"
                    value={arithmeticQuestion}
                    onChange={(e) => setArithmeticQuestion(e.target.value)}
                    placeholder="ex: 1+1 ="
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Final Answer:</label>
                <input
                    type="text"
                    value={finalAnswer}
                    onChange={(e) => setFinalAnswer(e.target.value)}
                    placeholder="ex: 2"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Timer (seconds):</label>
                <input
                    type="text"
                    value={timer}
                    onChange={(e) => setTimer(e.target.value)}
                    placeholder="ex: 5"
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

export default CreateTimerQuestions;
