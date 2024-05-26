import React, { useState, useEffect } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";
import styled from 'styled-components';

// Styled components for the Captcha container, grid, and square
const CaptchaContainer = styled.div`
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px); /* Adjust as needed */
  gap: 5px; /* Adjust as needed */
  margin-top: 20px;
`;

const GridSquare = styled.div`
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  border: 1px solid #ccc;
  cursor: pointer;
  background-size: 300px 300px; /* Adjust based on your image size */
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* Smooth transition for shadow and transform */

  &.selected {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add shadow */
    transform: scale(1.05); /* Slightly increase size to bring to front */
  }
`;

function CreateCaptchaCircles({ setCustomData, customData }) {
    const [selectedSquares, setSelectedSquares] = useState(customData?.selectedSquares || []);
    const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
    const [imageFile, setImageFile] = useState(customData?.imageFile || null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setQuestionPrompt(customData?.questionPrompt || "");
        setSelectedSquares(customData?.selectedSquares || []);
        setImageFile(customData?.imageFile || null);
    }, [customData]);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url); // Clean up the URL object when the component unmounts or imageFile changes
        }
    }, [imageFile]);

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const handleImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSquareClick = (squareId) => {
        setSelectedSquares((prev) => {
            if (prev.includes(squareId)) {
                return prev.filter((id) => id !== squareId); // Deselect the square
            }
            return [...prev, squareId]; // Select the square
        });
    };

    const saveExercise = async () => {
        const newCustomData = {
            questionPrompt: questionPrompt,
            imageFile: imageFile, // Include image file in custom data
            selectedSquares: selectedSquares // Pass the selected squares
        };
        setCustomData(newCustomData);
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
                    style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
                />
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageFileChange}
                    style={{ marginBottom: '10px' }}
                />
            </div>
            <div style={{ marginBottom: '40px' }}>
                {imageFile && (
                    <CaptchaContainer>
                        <GridContainer>
                            {Array.from({ length: 9 }, (_, i) => {
                                const row = Math.floor(i / 3);
                                const col = i % 3;
                                const backgroundPosition = `-${col * 100}px -${row * 100}px`;

                                return (
                                    <GridSquare
                                        key={i}
                                        className={selectedSquares.includes(i) ? 'selected' : ''}
                                        onClick={() => handleSquareClick(i)}
                                        style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition }}
                                    />
                                );
                            })}
                        </GridContainer>
                    </CaptchaContainer>
                )}
            </div>
            <SvgBtn
                handleClick={saveExercise}
                SvgIcon={documentIcon}
                text={"Make Exercise"}
                style={{ marginTop: '100px', alignSelf: 'center' }}
            />
        </div>
    );
}

export default CreateCaptchaCircles;
