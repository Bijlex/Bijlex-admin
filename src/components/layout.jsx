import { Outlet } from "react-router-dom";
import DialogContainer from "./general/modals/DialogContainer";
import Nav from "./Nav";

const Layout = () => {
  return (
    <div className="App">
      {/* <Nav /> */}
      <DialogContainer />
      <div className="top_bar">
        <h2>Bijlex</h2>
      </div>
      <div className="app_bottom">
        <Nav />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
