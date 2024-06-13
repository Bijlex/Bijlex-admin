import React, { useState, useEffect } from "react";
import SvgBtn from "../../../components/general/buttons/SvgBtn.jsx";
import { documentIcon } from "../../../constants/icons.jsx";
import styles from "../../../styles/captcha/CreateCaptchaCircles.module.css";

function CreateCaptchaImages({ setCustomData, customData }) {
  const [selectedSquares, setSelectedSquares] = useState(customData?.selectedSquares || []);
  const [questionPrompt, setQuestionPrompt] = useState(customData?.questionPrompt || "");
  const [imageFiles, setImageFiles] = useState(Array(9).fill(null));
  const [imageUrls, setImageUrls] = useState(Array(9).fill(""));

  useEffect(() => {
    setQuestionPrompt(customData?.questionPrompt || "");
    setSelectedSquares(customData?.selectedSquares || []);
  }, [customData]);

  useEffect(() => {
    const urls = imageFiles.map((file) => (file ? URL.createObjectURL(file) : ""));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imageFiles]);

  const handleQuestionPromptChange = (event) => {
    setQuestionPrompt(event.target.value);
  };

  const handleImageFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = file;
      setImageFiles(newImageFiles);
    }
  };

  const handleSquareClick = (squareId) => {
    setSelectedSquares((prev) => {
      if (prev.includes(squareId)) {
        return prev.filter((id) => id !== squareId);
      }
      return [...prev, squareId];
    });
  };

  const saveExercise = async () => {
    if (imageFiles.some((file) => !file)) {
      alert("Please select an image file for each square before saving.");
      return;
    }

    try {
      const imageBase64Array = await Promise.all(
        imageFiles.map((file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          })
        )
      );

      const newCustomData = {
        questionPrompt: questionPrompt,
        images: imageBase64Array,
        selectedSquares: selectedSquares,
      };

      setCustomData(newCustomData);
    } catch (error) {
      console.error("Error converting images to Base64:", error);
      alert("There was an error processing the images. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>Question Prompt:</label>
        <input
          type="text"
          value={questionPrompt}
          onChange={handleQuestionPromptChange}
          placeholder="Enter the question prompt"
          className={styles.input}
        />
        {Array.from({ length: 9 }).map((_, index) => (
          <input
            key={index}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => handleImageFileChange(index, e)}
            className={styles.fileInput}
          />
        ))}
      </div>
      <div style={{ marginBottom: "40px" }}>
        {imageUrls.some((url) => url) && (
          <div className={styles.captchaContainer}>
            <div className={styles.gridContainer}>
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.gridSquare} ${selectedSquares.includes(i) ? styles.selected : ""}`}
                  onClick={() => handleSquareClick(i)}
                  style={{
                    backgroundImage: `url(${imageUrls[i]})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <SvgBtn
        handleClick={saveExercise}
        SvgIcon={documentIcon}
        text={"Make Exercise"}
        className={styles.svgBtnContainer}
      />
    </div>
  );
}

export default CreateCaptchaImages;