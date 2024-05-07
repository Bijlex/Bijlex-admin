// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import { MessageProvider } from "./contexts/MessageContext";
import Layout from "./components/layout";
import TrueHome from "./pages/TrueHome";
import CreateTableExercise from "./pages/Graph&Tables/admin/CreateTableExercise";
import ExercisePage from "./pages/ExercisePage";
import CreateGraphToTable from "./pages/Graph&Tables/admin/CreateGraphToTable";
import CreateParabola from "./pages/Graph&Tables/admin/CreateParabola";
import CreateMatchingPair from "./pages/Matching/admin/CreateMatchingPair";
import EditMatchingPair from "./pages/Matching/admin/EditMatchingPair";
import BijlexHome from "./pages/BijlexHome";

const App = () => {
  return (
    <Router>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BijlexHome />} />
            <Route path="/table-exercise">
              <Route index element={<TrueHome />} />
              <Route
                path="/table-exercise/create"
                element={<CreateTableExercise />}
              />
            </Route>
            <Route path="/graph-to-table">
              <Route index element={<TrueHome />} />
              <Route
                path="/graph-to-table/create"
                element={<CreateGraphToTable />}
              />
            </Route>
            <Route path="/parabola">
              <Route index element={<TrueHome />} />
              <Route path="/parabola/create" element={<CreateParabola />} />
            </Route>
            <Route path="/matching-pairs">
              <Route index element={<TrueHome />} />
              <Route
                path="/matching-pairs/create"
                element={<CreateMatchingPair />}
              />
              <Route
                path="/matching-pairs/edit/:id"
                element={<EditMatchingPair />}
              />
            </Route>
            <Route path="/:id">
              <Route index element={<ExercisePage />} />
            </Route>
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
