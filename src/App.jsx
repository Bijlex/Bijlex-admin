// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import { MessageProvider } from "./contexts/MessageContext";
import Layout from "./components/layout";
import ExercisePage from "./pages/ExercisePage";
import BijlexHome from "./pages/BijlexHome";

const App = () => {
  return (
    <Router>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BijlexHome />} />
            <Route path="/:id">
              <Route index element={<ExercisePage />} />
            </Route>
          </Route>
        </Routes>
      </MessageProvider>
    </Router>
  );
};

export default App;
