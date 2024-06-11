import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

Chart.register(ArcElement, Tooltip, Legend);

function CreateSimplifyFractions({ setCustomData, customData = {} }) {
    const [questionPrompt, setQuestionPrompt] = useState(customData.questionPrompt || "");
    const [fractionNumber, setFractionNumber] = useState(customData.fractionNumber || "");
    const [selectedPie, setSelectedPie] = useState(customData.selectedPies?.[0] || null);

    useEffect(() => {
        setQuestionPrompt(customData.questionPrompt || "");
        setFractionNumber(customData.fractionNumber || "");
        setSelectedPie(customData.selectedPies?.[0] || null);
    }, [customData]);

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const handleFractionNumberChange = (event) => {
        setFractionNumber(event.target.value);
    };

    const handlePieSelectionChange = (divisions) => {
        setSelectedPie(divisions);
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt: questionPrompt,
            fractionNumber: fractionNumber,
            selectedPies: [selectedPie]
        };
        setCustomData(customData);
    };

    const pieData = (divisions) => ({
        labels: Array(divisions).fill(''),
        datasets: [{
            data: Array(divisions).fill(1),
            backgroundColor: Array(divisions).fill('#36A2EB'),
        }]
    });

    const pieOptions = {
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: "40px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label style={{ marginBottom: "5px" }}>Question Prompt:</label>
                <input
                    type="text"
                    value={questionPrompt}
                    onChange={handleQuestionPromptChange}
                    placeholder="Enter the question prompt"
                    style={{
                        width: "400px",
                        padding: "8px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>
            <div style={{ marginBottom: "40px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label style={{ marginBottom: "5px" }}>Input the fraction number:</label>
                <input
                    type="text"
                    value={fractionNumber}
                    onChange={handleFractionNumberChange}
                    placeholder="Enter the fraction number"
                    style={{
                        width: "400px",
                        padding: "8px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '30px' }}>
                {[4, 6, 8, 10].map((divisions, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="radio"
                            name="pieSelection"
                            value={divisions}
                            checked={selectedPie === divisions}
                            onChange={() => handlePieSelectionChange(divisions)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Pie data={pieData(divisions)} options={pieOptions} />
                    </div>
                ))}
            </div>
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginBottom: "30px", alignSelf: "center" }}
            />
        </div>
    );
}

export default CreateSimplifyFractions;
