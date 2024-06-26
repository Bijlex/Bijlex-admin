import React, { useEffect, useState } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn";
import { documentIcon } from "../../../constants/icons.jsx";

const CreateMagicSquare = ({ setCustomData, customData }) => {
  const [questionPrompt, setQuestionPrompt] = useState(
    customData?.questionPrompt || ""
  );
  const [items, setItems] = useState(
    customData?.items || [
      { name: "", price: "" },
      { name: "", price: "" },
      { name: "", price: "" },
      { name: "", price: "" },
      { name: "", price: "" },
    ]
  );
  const [itemsLimit, setItemsLimit] = useState(customData?.itemsLimit || "");
  const [priceLimit, setPriceLimit] = useState(customData?.priceLimit || "");

  useEffect(() => {
    setItems(
      customData?.items || [
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
      ]
    );
    setQuestionPrompt(customData?.questionPrompt || "");
    setItemsLimit(customData?.itemsLimit || "");
    setPriceLimit(customData?.priceLimit || "");
  }, [customData]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const saveExercise = async () => {
    const customData = {
      questionPrompt,
      items,
      itemsLimit,
      priceLimit,
    };
/**
       N1   |s1|   N2  = A1  
       s2 -- +  -- s3 
       N3   |s4|   N4  = A2
        = ----------=----       
       A3          A4

       hidden answers is from 1 to 8
       1 - 4 is N1 - N4
       5 -8  is A1 -A4
  
 */
    const bigSquares = [0, 1, 2, 3];
    const smallSquares = ['+', '-', '-', '*'];
    const answers = [ 4, 6, 3, 0];
    const hiddenIndices = [4, 6]; // You can change these values as needed
    
    const fakeData = {bigSquares, smallSquares, answers, hiddenIndices }
   
    setCustomData(fakeData);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <table >
          <tr> 
            <td>number 1</td>
            <td>Sign 1</td>
            <td>Number 2</td>
             <to>answer 1</to>
          </tr>
        </table>
      </div>
      <label style={{ marginBottom: "10px" }}>
        Question Prompt:
        <input
          type="text"
          value={questionPrompt}
          onChange={(e) => setQuestionPrompt(e.target.value)}
          placeholder="Enter your question prompt"
          style={{
            width: "400px",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
      </label>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <label style={{ marginRight: "10px" }}>
            Item {index + 1} Name:
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              placeholder="Enter item name"
              style={{
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              placeholder="Enter item price"
              style={{
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </label>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: "20px 0",
        }}
      >
        <label style={{ marginRight: "10px" }}>
          Number of Items Limit:
          <input
            type="number"
            value={itemsLimit}
            onChange={(e) => setItemsLimit(e.target.value)}
            placeholder="Enter the limit on number of items"
            style={{
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label>
          Price Limit:
          <input
            type="number"
            value={priceLimit}
            onChange={(e) => setPriceLimit(e.target.value)}
            placeholder="Enter the price limit"
            style={{
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
      </div>
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        style={{ marginBottom: "30px", alignSelf: "center" }} // Center button, adjust margin if needed
      />
    </div>
  );
};

export default CreateMagicSquare;
