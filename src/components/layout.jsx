import { Outlet } from "react-router-dom";
import DialogContainer from "./general/modals/DialogContainer";

const Layout = () => {
  return (
    <div className="App">
      {/* <Nav /> */}
      <DialogContainer />
      <Outlet />
    </div>
  );
};

export default Layout;
