// import React, { useState } from 'react';
// import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
// import { documentIcon } from "../../../constants/icons.jsx";

// function CreateSquaresToDice({ setCustomData }) {
//     const [questionPrompt, setQuestionPrompt] = useState(''); 
//     const [squareValues, setSquareValues] = useState(Array(6).fill(''));

//     const handleQuestionPromptChange = (event) => {
//         setQuestionPrompt(event.target.value);
//     };

//     const handleSquareChange = (index, event) => {
//         const value = event.target.value;
//         setSquareValues(prevValues => {
//             const newValues = [...prevValues];
//             newValues[index] = value;
//             return newValues;
//         });
//     };

//     const saveExercise = async () => {
//         const customData = {
//             questionPrompt: questionPrompt,
//             squareValues: squareValues
//         }
//         setCustomData(customData);
//     };

//     return (
//         <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <div style={{ marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <label style={{ marginBottom: '5px' }}>Question Prompt:</label>
//                 <input
//                     type="text"
//                     value={questionPrompt}
//                     onChange={handleQuestionPromptChange}
//                     placeholder="Enter the question prompt"
//                     style={{ width: '400px', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
//                 />
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gridTemplateRows: 'repeat(4, 100px)', gap: '0px', marginBottom: '30px' }}>
//                 {[
//                     null, 0, null,
//                     1, 2, 3,
//                     null, 4, null,
//                     null, 5, null,
//                 ].map((index, idx) => (
//                     <div
//                         key={idx}
//                         style={{
//                             width: '100px',
//                             height: '100px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             border: index !== null ? '1px solid #000' : 'none',
//                             backgroundColor: index !== null ? '#fff' : 'transparent'
//                         }}
//                     >
//                         {index !== null ? (
//                             <input
//                                 type="number"
//                                 value={squareValues[index]}
//                                 onChange={(e) => handleSquareChange(index, e)}
//                                 style={{
//                                     width: '80%',
//                                     height: '80%',
//                                     fontSize: '16px',
//                                     textAlign: 'center',
//                                     border: 'none',
//                                     outline: 'none',
//                                 }}
//                             />
//                         ) : null}
//                     </div>
//                 ))}
//             </div>
//             <SvgBtn
//                 handleClick={saveExercise}
//                 SvgIcon={documentIcon}
//                 text={"Make Exercise"}
//                 style={{ marginBottom: '30px', alignSelf: 'center' }} 
//             />
//         </div>
//     );
// }

// export default CreateSquaresToDice;

import React, { useState } from 'react';
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";

function CreateSquaresToDice({ setCustomData }) {
    const [questionPrompt, setQuestionPrompt] = useState(''); 
    const [squareValues, setSquareValues] = useState(Array(6).fill(''));

    const handleQuestionPromptChange = (event) => {
        setQuestionPrompt(event.target.value);
    };

    const handleSquareChange = (index, event) => {
        const value = event.target.value;
        setSquareValues(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = value;
            return newValues;
        });
    };

    const saveExercise = async () => {
        const customData = {
            questionPrompt: questionPrompt,
            squares: squareValues.map((value, index) => ({ index, value }))
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gridTemplateRows: 'repeat(4, 100px)', gap: '0px', marginBottom: '30px' }}>
                {[
                    null, 0, null,
                    1, 2, 3,
                    null, 4, null,
                    null, 5, null,
                ].map((index, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: index !== null ? '1px solid #000' : 'none',
                            backgroundColor: index !== null ? '#fff' : 'transparent'
                        }}
                    >
                        {index !== null ? (
                            <input
                                type="number"
                                value={squareValues[index]}
                                onChange={(e) => handleSquareChange(index, e)}
                                style={{
                                    width: '80%',
                                    height: '80%',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    border: 'none',
                                    outline: 'none',
                                }}
                            />
                        ) : null}
                    </div>
                ))}
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

export default CreateSquaresToDice;
