import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function MagicSquare({ customData }) {
 const { bigSquares, smallSquares, answers, hiddenIndices } = customData;

 const [inputs, setInputs] = useState({});
 const hiddenIndicesArray = hiddenIndices.split(",").map(Number);
const smallSquaresArray = smallSquares.split(",");
const answersArray = answers.split(",").map(Number);

const handleChange = (e , index) => {
 setInputs({
 ...inputs,
[index]:e.target.value,
});
};

 const checkAnswers = () => {
 const correct = hiddenIndicesArray.every((index,i) => {
 const userAnswer = parseInt(inputs[index], 10);
 return userAnswer === correctAnswers[i];
 });
 alert(correct ? "Correct!" : "Try again!");
 };
 const containerStyles = {
  display: "grid",
  "grid-template-columns": "repeat(2, 100 px)",
  "grid-template-rows": "repeat(2, 100px)",
  gap: 0,
  position : "relative",
  width: "200px", /* 2 * 100px */
  height: "200 px", /* 2 * 100px */
 };
 
 const bigSquareStyles = {
  width: "100px",
  height: "100px",
  "background-color": "lightblue",
  border: "1px solid #000",
  display: "flex",
  "justify-content": "center",
  "align-items": "center",
  "font -size": "24px",
  position: "relative",
 };
 
 const smallSquareStyles = {
  width: "30px",
  height: "30px",
  "background-color": "lightcoral",
  border: "1px solid #00 0",
  display: "flex",
  "justify-content": "center",
  "align-items": "center",
  "font-size": "18px",
  position: "absolute",
  transform: "translate(-50%, -50%)",
 };
 
  const answerSquareStyle = {
  width: "50px",
  height: "50px",
  "background-color": "lightblue",
  border: "1px solid #000",
  display: "flex",
  "justify-content": "center ",
  "align-items": "center",
  "font-size": "18px",
  position: "absolute",
  transform: "translate(-50%, -50%)",
 };

 const smallSquaresPositions = [
  { gridRow: " 2 / 3", gridColumn: "2 / 3" }, // between 1 and 3
  { gridRow: "2 / 3 ", gridColumn: "1 / 2" }, // between 2 and 3
  { gridRow: "1 / 2", gridColumn : "1 / 2" }, // between 0 and 2
  { gridRow: "1 / 2", gridColumn: "1 / 2" }, // between 0 and 1
  { gridRow: " 1 / 2", gridColumn: "2 / 2" }, // right of 1
  { gridRow: "3 / 3", gridColumn: "1 / 2" }, // bottom of 2
  { gridRow: "3 / 3", gridColumn: "2 / 3" }, // bottom of 3
  { gridRow: "2 / 3", gridColumn: "2 / 2" }, // right of 3
  ];
  
  const answersPosition = [
  { gridRow : "1 / 2", gridColumn: "3 / 3" }, // right of 1
  { gridRow: "2 / 3", gridColumn: "3 / 3" }, // right of 3
  { gridRow: "3 / 3", gridColumn: "2 / 3" }, // bottom of 3
  { gridRow: "3 / 3", gridColumn: "1 / 2" }, // bottom of 2
  ];
 

 return (
 < DndProvider backend={HTML5Backend}>
 <div style={containerStyles}> 
{hiddenIndicesArray.map((index,i)=> (
 <div key={index} style={{ ...bigSquareStyles,gridArea:`${Math.floor(index/2) + 1} / ${index % 2 + 1} / ${Math.floor(index/2) + 2} / ${index % 2 + 2}` }}>
 <input type="number" value={inputs[index] || ""} onChange={(e) => handleChange(e, index)} />
 </div >
 ))}
 {smallSquaresArray.map((item,index)=> (
 <div key={index} style={{ ...smallSquareStyles,...smallSquaresPositions[index]}}>
{item}
 </div>
 ))}
 {answersArray.map((item,index)=> (
 <div key={index} style={{ ...answerSquareStyle,...answersPosition[index]}}>
 {hiddenIndicesArray.includes(index+4) ? (
 <input type="number" value={inputs[index + 4] || ""} onChange={(e) => handleChange(e, index + 4)} /> 
) : (
 item
 )}
 </div>
 ))}
 <div style={{ marginTop: "70px" }}>
 <button onClick={checkAnswers}>Check Answers</button>
 </div>
 </div>
 </DndProvider>
 );
}

export default MagicSquare ;
