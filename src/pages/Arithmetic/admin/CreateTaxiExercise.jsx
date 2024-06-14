import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateTaxiExercise({ setCustomData, customData }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [startingPrice, setStartingPrice] = useState(customData?.startingPrice || "");
    const [kilometers, setKilometers] = useState(customData?.kilometers || "");
    const [pricePerKm, setPricePerKm] = useState(customData?.pricePerKm || "");
    const [finalPrice, setFinalPrice] = useState(customData?.finalPrice || "");

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setStartingPrice(customData?.startingPrice || "");
        setKilometers(customData?.kilometers || "");
        setPricePerKm(customData?.pricePerKm || "");
        setFinalPrice(customData?.finalPrice || "");
    }, [customData]);

    const saveExercise = async () => {
        const newCustomData = {
            questionPrompt: questionPrompt,
            startingPrice: startingPrice,
            kilometers: kilometers,
            pricePerKm: pricePerKm,
            finalPrice: finalPrice,
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
                <label style={{ marginBottom: '5px' }}>Starting Price:</label>
                <input
                    type="text"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="Enter the starting price"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Kilometers:</label>
                <input
                    type="text"
                    value={kilometers}
                    onChange={(e) => setKilometers(e.target.value)}
                    placeholder="Enter the kilometers"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Price per Kilometer:</label>
                <input
                    type="text"
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                    placeholder="Enter the price per kilometer"
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ marginBottom: '5px' }}>Final Price:</label>
                <input
                    type="text"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="Enter the final price"
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

export default CreateTaxiExercise;
