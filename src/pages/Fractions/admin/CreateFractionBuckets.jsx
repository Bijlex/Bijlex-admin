import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed or import it correctly
import { useMessage } from '../../../contexts/MessageContext'; // Adjust the path based on your project structure
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateFractionBuckets({ setCustomData }) {
    const [bucketCount, setBucketCount] = useState(3);
    const [fractions, setFractions] = useState(Array(3).fill(''));
    const [showBuckets, setShowBuckets] = useState(false);
    const [questionPrompt, setQuestionPrompt] = useState('');
    const { addDialog, removeDialog, addFullscreenConfirmationDialog } = useMessage();

    const handleBucketCountChange = (event) => {
        const count = parseInt(event.target.value, 10);
        setBucketCount(count);
        setFractions(Array(count).fill(''));
        setShowBuckets(false);
    };

    const handleFractionChange = (index, value) => {
        const newFractions = [...fractions];
        newFractions[index] = value;
        setFractions(newFractions);
    };

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const isValidFraction = (fraction) => {
        const fractionRegex = /^\d+\/\d+$/;
        return fractionRegex.test(fraction);
    };

    const saveExercise = async () => {
        const allValid = fractions.every(isValidFraction);

        if (!allValid) {
            alert("All fractions must be in the format 'numerator/denominator' (e.g., 1/2, 3/4). Please correct your inputs.");
            return;
        }

        const customData = {
            bucketCount: bucketCount,
            fractions: fractions,
            questionPrompt: questionPrompt // Include the prompt in customData
        }
        setCustomData(customData);
    };
    
    const AdminBucket = ({ fraction, total }) => {
        const height = `${(fraction / total) * 100}%`;
        return (
            <div style={{ position: 'relative', width: '100px', height: '150px', border: '3px solid black', borderTop: 'none', borderRadius: '5px', margin: '5px' }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: height, backgroundColor: 'rgb(76, 245, 236)', borderRadius: '5px 5px 0 0' }}></div>
            </div>
        );
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
             <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                 {['3', '4', '5', '6'].map(number => (
                    <label key={number} style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="radio"
                            value={number}
                            checked={bucketCount === parseInt(number, 10)}
                            onChange={handleBucketCountChange}
                        />
                        {number} Buckets
                    </label>
                ))}
            </div>
            <div style={{ margin: '30px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {fractions.map((fraction, index) => (
                    <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                        <label style={{ marginRight: '10px' }}>Bucket {index + 1} Fraction:</label>
                        <input
                            type="text"
                            value={fraction}
                            onChange={(e) => handleFractionChange(index, e.target.value)}
                            placeholder="Enter fraction (e.g., 1/2)"
                            style={{ width: '200px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                ))}
            </div>
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginBottom: '30px', alignSelf: 'center' }} // Center button, adjust margin if needed
            />

            {showBuckets && (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                    {fractions.map((fraction, index) => {
                        const fillLevel = fraction ? parseFloat(eval(fraction)) : 0;
                        return fraction ? <AdminBucket key={index} fraction={fillLevel} total={1} /> : null;
                    })}
                </div>
            )}
        </div>
    );
}

export default CreateFractionBuckets;

