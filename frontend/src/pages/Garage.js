import { BrowserRouter, Routes, Route } from "react-router-dom";
import GarageNavbar from "./GarageNavbar";

function Garage() {
  return (
    <div>
      <GarageNavbar />
      <Routes>
        <Route path="/garage/vehicle-info" />
        <Route path="/garage/vehicle-history" />
      </Routes>
    </div>
  );
}

export default Garage;