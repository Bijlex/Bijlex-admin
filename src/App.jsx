// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import "./styles/globals.css";
import { MessageProvider } from "./contexts/MessageContext";
import Layout from "./components/layout";
import TrueHome from "./components/pages/TrueHome";
import CreateTableExercise from "./components/pages/Graph&Tables/admin/CreateTableExercise";
import TableExercise from "./components/pages/Graph&Tables/client/TableExercise";

const App = () => {
  return (
    <Router>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/table-exercise">
              <Route index element={<Home />} />
              <Route
                path="/table-exercise/create"
                element={<CreateTableExercise />}
              />
              <Route path="/table-exercise/:id" element={<TableExercise />} />
            </Route>
            <Route path="/new-home" element={<TrueHome />} />
          </Route>
          {/* Set Home as the default route */}
          {/* <Route path="/graph-to-table" element={<GraphToTable />} /> */}

          {/* <Route path="/table-to-graph" element={<TableToGraph />} /> */}
        </Routes>
      </MessageProvider>
    </Router>
  );
};

export default App;
