import React, { useState } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateCircleToOval({ setCustomData }) {
    const [questionPrompt, setQuestionPrompt] = useState(''); 

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt: questionPrompt 
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
                    onChange={handleQuestionPromptChange}
                    placeholder="Enter the question prompt"
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

export default CreateCircleToOval;