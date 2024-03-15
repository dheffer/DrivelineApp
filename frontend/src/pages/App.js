import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Garage from "./Garage";
import VehicleInfo from "./VehicleInfo";
import VehicleHistory from "./VehicleHistory";

function App() {
  return (
    <BrowserRouter>
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/garage" element={<Garage />}/>
        <Route path="/garage/vehicle-info" element={<VehicleInfo />} />
        <Route path="/garage/vehicle-history" element={<VehicleHistory />}  />
        <Route path="/settings" />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;