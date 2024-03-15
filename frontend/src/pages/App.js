import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Garage from "./Garage";
import VehicleInfo from "./VehicleInfo";
import VehicleHistory from "./VehicleHistory";
import UploadVehicleHistory from "./UploadVehicleHistory";
import ManualVehicleHistory from "./ManualVehicleHistory";
import AddVehicle from "./AddVehicle";
import RemoveVehicle from "./RemoveVehicle";

function App() {
  return (
    <BrowserRouter>
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/garage" element={<Garage />}/>
        <Route path="/garage/add" element={<AddVehicle />}/>
        <Route path="/garage/remove" element={<RemoveVehicle />}/>

        <Route path="/garage/vehicle-info" element={<VehicleInfo />} />
        <Route path="/garage/vehicle-history" element={<VehicleHistory />}  />
        <Route path="/garage/vehicle-history/upload" element={<UploadVehicleHistory />} />
        <Route path="/garage/vehicle-history/manual" element={<ManualVehicleHistory />} />

        <Route path="/settings" />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;