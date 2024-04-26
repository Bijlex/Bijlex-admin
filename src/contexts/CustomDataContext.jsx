import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

const CustomDataContext = createContext({
  data: {}, // Initial data
  setData: () => {}, // A noop function for initial setup
});

const CustomDataProvider = ({ children }) => {
  const [data, setData] = useState({}); // Initial state is empty

  return (
    <CustomDataContext.Provider value={{ data, setData }}>
      {children || <Outlet />}
    </CustomDataContext.Provider>
  );
};
