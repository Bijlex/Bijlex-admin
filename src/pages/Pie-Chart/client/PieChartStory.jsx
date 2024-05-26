import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function PieChartStory({ customData }) {
    const [items, setItems] = useState(customData.items || []);
    const [placedItems, setPlacedItems] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const chartRef = useRef(null);
    const questionPrompt = customData?.questionPrompt || "No prompt provided";

    useEffect(() => {
        setItems(customData.items || []);

        // Initialize placedItems state with empty values for each target
        const initialPlacedItems = {};
        items.forEach((_, index) => {
            initialPlacedItems[`item-${index}`] = null;
        });
        setPlacedItems(initialPlacedItems);
    }, [customData, items]);

    const handleDrop = (event, target) => {
        const itemIndex = event.dataTransfer.getData("text");
        const newPlacedItems = { ...placedItems, [target]: items[itemIndex] };
        setPlacedItems(newPlacedItems);
    };

    const handleDragStart = (event, index) => {
        event.dataTransfer.setData("text", index);
        setFeedbackMessage("");
        setIsCorrect(null);
    };

    const checkAnswers = () => {
        const isEmptyDropTarget = Object.values(placedItems).some(item => !item);
        if (isEmptyDropTarget) {
            setFeedbackMessage("Every item has to be in the chart.");
            return;
        }
    
        const placedItemNames = Object.values(placedItems).map(item => item.name);
        const uniquePlacedItemNames = new Set(placedItemNames);
        if (placedItemNames.length !== uniquePlacedItemNames.size) {
            setFeedbackMessage("Every item has to be in the chart.");
            return;
        }
    
        const placedValues = Object.values(placedItems).map(item => item ? item.number : null);
        const itemValues = items.map(item => item.number);
    
        const correct = itemValues.every((value, index) => {
            const placedValue = placedValues[index];
            return placedValue === value;
        });
    
        setIsCorrect(correct);
    
        if (correct) {
            setErrorMessage("");
            setFeedbackMessage("Correct!");
        } else {
            setAttempts(attempts + 1);
            setFeedbackMessage("Some items are not placed correctly. Please try again.");
        }
    };

    const data = {
        labels: items.map((item, index) => `Item ${index + 1}`),
        datasets: [
            {
                data: items.map(item => item.number),
                backgroundColor: items.map(() => 'rgba(255, 99, 132, 0.2)'),
                borderColor: items.map(() => 'rgba(255, 99, 132, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
        },
        animation: false, // Disable animation for accurate calculation
    };

    const calculatePositions = () => {
        if (!chartRef.current) return [];

        const chartInstance = chartRef.current;
        const meta = chartInstance.getDatasetMeta(0);
        const positions = meta.data.map((arc, index) => {
            const angle = (arc.startAngle + arc.endAngle) / 2;
            const radius = 100; // Radius to place the drop targets
            const x = chartInstance.chartArea.left + arc.x + radius * Math.cos(angle);
            const y = chartInstance.chartArea.top + arc.y + radius * Math.sin(angle);
            return { x, y };
        });
        return positions;
    };

    const positions = calculatePositions();

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>{questionPrompt}</h2>
            <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '20px' }}>
                <Pie
                    data={data}
                    options={options}
                    ref={chartRef}
                />
                {positions.map((pos, index) => (
                    <div
                        key={index}
                        onDrop={(e) => handleDrop(e, `item-${index}`)}
                        onDragOver={(e) => e.preventDefault()}
                        style={{
                            position: 'absolute',
                            top: `${pos.y}px`,
                            left: `${pos.x}px`,
                            width: '50px',
                            height: '50px',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            border: '1px solid rgba(255, 99, 132, 1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black',
                            transform: 'translate(-50%, -50%)', // Center the circles
                        }}
                    >
                        {placedItems[`item-${index}`]?.name}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        style={{
                            width: '100px',
                            height: '50px',
                            backgroundColor: '#ddd',
                            marginBottom: '10px',
                            textAlign: 'center',
                            lineHeight: '50px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
            <button
                onClick={checkAnswers}
                style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', marginTop: '20px' }}
            >
                Check
            </button>
            {feedbackMessage && (
                <p style={{ color: isCorrect ? 'green' : 'red', marginTop: '20px' }}>{feedbackMessage}</p>
            )}
            {feedbackMessage && !isCorrect && attempts < 2 && (
                <button
                    onClick={() => setPlacedItems(Object.fromEntries(Object.keys(placedItems).map(key => [key, null])))}
                    style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', marginTop: '20px' }}
                >
                    Retry
                </button>
            )}
            {attempts >= 2 && (
                <button
                    onClick={() => alert('Continue to the next question')}
                    style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', marginTop: '20px' }}
                >
                    Continue
                </button>
            )}
        </div>
    );
}

export default PieChartStory;
