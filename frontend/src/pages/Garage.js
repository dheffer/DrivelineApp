import { BrowserRouter, Routes, Route } from "react-router-dom";
import GarageNavbar from "./GarageNavbar";
import AddRemoveNavbar from "./AddRemoveNavbar";

function Garage() {
  return (
    <div>
      <AddRemoveNavbar />
      <Routes>
        <Route path="/garage/add" />
        <Route path="/garage/remove" />
      </Routes>
    </div>
  );
}

export default Garage;