// src/components/EditOrderPopup.js
import React, { useEffect, useState } from "react";
import "../../styles/EditOrderPopup.css";

const EditOrderPopup = ({ question, onClose, onUpdate }) => {
  const [order, setOrder] = useState(question.question || 1);
  const [subOrder, setSubOrder] = useState(question.variation || "");

  const handleUpdate = () => {
    onUpdate(question._id, order, subOrder);
  };

  useEffect(() => {
    setOrder(question.question);
    setSubOrder(question.variation);
  }, [question]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Order</h2>
        <label>
          Order
          <input
            type="number"
            value={order}
            min="1"
            onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <label>
          Sub-order
          <input
            type="text"
            value={subOrder}
            onChange={(e) => setSubOrder(e.target.value)}
          />
        </label>
        <div className="popup-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleUpdate}>Update Order</button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPopup;
