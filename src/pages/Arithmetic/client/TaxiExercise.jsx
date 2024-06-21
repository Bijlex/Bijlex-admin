import React, { useState, useEffect } from 'react';

function TaxiExercise({ customData }) {
    const [startingPrice, setStartingPrice] = useState(parseFloat(customData?.startingPrice) || 0);
    const [distance, setDistance] = useState(parseFloat(customData?.kilometers) || 0);
    const [pricePerKm, setPricePerKm] = useState(parseFloat(customData?.pricePerKm) || 0);
    const [finalPrice, setFinalPrice] = useState(parseFloat(customData?.finalPrice) || 0);
    const [selectedOption, setSelectedOption] = useState("Final Price");
    const [isGenerated, setIsGenerated] = useState(false);
    const [formulaInput, setFormulaInput] = useState("");
    const [isFormulaCorrect, setIsFormulaCorrect] = useState(null);

    useEffect(() => {
        setStartingPrice(parseFloat(customData?.startingPrice) || 0);
        setDistance(parseFloat(customData?.kilometers) || 0);
        setPricePerKm(parseFloat(customData?.pricePerKm) || 0);
        setFinalPrice(parseFloat(customData?.finalPrice) || 0);
    }, [customData]);

    const handleInputChange = (setter) => (e) => {
        setter(parseFloat(e.target.value) || 0);
        setIsGenerated(false);
    };

    const handleFormulaChange = (e) => {
        setFormulaInput(e.target.value);
    };

    const generateValue = () => {
        let generatedValue;
        switch (selectedOption) {
            case "Starting Price":
                generatedValue = (finalPrice - (distance * pricePerKm)).toFixed(2);
                setStartingPrice(parseFloat(generatedValue));
                break;
            case "Distance (km)":
                generatedValue = ((finalPrice - startingPrice) / pricePerKm).toFixed(2);
                setDistance(parseFloat(generatedValue));
                break;
            case "Price/km":
                generatedValue = ((finalPrice - startingPrice) / distance).toFixed(2);
                setPricePerKm(parseFloat(generatedValue));
                break;
            case "Final Price":
                generatedValue = (startingPrice + (distance * pricePerKm)).toFixed(2);
                setFinalPrice(parseFloat(generatedValue));
                break;
            default:
                break;
        }
        setIsGenerated(true);
    };

    const checkFormula = () => {
        const trimmedInput = formulaInput.replace(/\s+/g, '');
        const correctAnswers = ["y=ax+b", "y=a*x+b"];
        setIsFormulaCorrect(correctAnswers.includes(trimmedInput.toLowerCase()));
    };

    const renderFieldsAboveButton = () => {
        switch (selectedOption) {
            case "Starting Price":
                return (
                    <>
                        {renderField("Distance (km)", distance, handleInputChange(setDistance))}
                        {renderField("Price/km", pricePerKm, handleInputChange(setPricePerKm))}
                        {renderField("Final Price", finalPrice, handleInputChange(setFinalPrice))}
                    </>
                );
            case "Distance (km)":
                return (
                    <>
                        {renderField("Starting Price", startingPrice, handleInputChange(setStartingPrice))}
                        {renderField("Price/km", pricePerKm, handleInputChange(setPricePerKm))}
                        {renderField("Final Price", finalPrice, handleInputChange(setFinalPrice))}
                    </>
                );
            case "Price/km":
                return (
                    <>
                        {renderField("Starting Price", startingPrice, handleInputChange(setStartingPrice))}
                        {renderField("Distance (km)", distance, handleInputChange(setDistance))}
                        {renderField("Final Price", finalPrice, handleInputChange(setFinalPrice))}
                    </>
                );
            case "Final Price":
                return (
                    <>
                        {renderField("Starting Price", startingPrice, handleInputChange(setStartingPrice))}
                        {renderField("Distance (km)", distance, handleInputChange(setDistance))}
                        {renderField("Price/km", pricePerKm, handleInputChange(setPricePerKm))}
                    </>
                );
            default:
                return null;
        }
    };

    const renderFieldBelowButton = () => {
        if (!isGenerated) return null;
        switch (selectedOption) {
            case "Starting Price":
                return renderField("Starting Price", startingPrice, handleInputChange(setStartingPrice));
            case "Distance (km)":
                return renderField("Distance (km)", distance, handleInputChange(setDistance));
            case "Price/km":
                return renderField("Price/km", pricePerKm, handleInputChange(setPricePerKm));
            case "Final Price":
                return renderField("Final Price", finalPrice, handleInputChange(setFinalPrice));
            default:
                return null;
        }
    };

    const renderField = (label, value, onChange) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label htmlFor={label} style={{ color: 'white', minWidth: '120px' }}>{label}:</label>
            <input
                id={label}
                type="number"
                value={value}
                onChange={onChange}
                style={{
                    width: '80px',
                    padding: '5px',
                    fontSize: '16px',
                    textAlign: 'right',
                    backgroundColor: 'black',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px'
                }}
            />
        </div>
    );

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ marginBottom: '30px', color: 'black' }}>{customData?.questionPrompt || "No question prompt provided"}</h2>
            <div style={{
                width: '300px',
                minHeight: '420px',
                backgroundColor: 'black',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="selectOption" style={{ color: 'white', minWidth: '120px' }}>Select Value to Generate:</label>
                    <select id="selectOption" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} style={{ color: 'black', padding: '5px', borderRadius: '4px', minWidth: '120px' }}>
                        <option value="Starting Price">Starting Price</option>
                        <option value="Distance (km)">Distance (km)</option>
                        <option value="Price/km">Price/km</option>
                        <option value="Final Price">Final Price</option>
                    </select>
                </div>
                {renderFieldsAboveButton()}
                <button
                    onClick={generateValue}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Generate {selectedOption}
                </button>
                {renderFieldBelowButton()}
            </div>
            <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '300px' }}>
                    <label htmlFor="formulaInput" style={{ color: 'black', minWidth: '120px' }}>Enter Formula:</label>
                    <input
                        id="formulaInput"
                        type="text"
                        value={formulaInput}
                        onChange={handleFormulaChange}
                        style={{
                            width: '120px',
                            padding: '5px',
                            fontSize: '16px',
                            textAlign: 'right',
                            backgroundColor: 'white',
                            color: 'black',
                            border: '1px solid black',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <button
                    onClick={checkFormula}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Check Answer
                </button>
                {isFormulaCorrect !== null && (
                    <p style={{ color: isFormulaCorrect ? 'green' : 'red', marginTop: '10px' }}>
                        {isFormulaCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TaxiExercise;
