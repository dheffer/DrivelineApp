import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Garage from "./garage/Garage";
import VehicleInfo from "./vehicle/VehicleInfo";
import VehicleHistory from "./vehicle/VehicleHistory";
import UploadVehicleHistory from "./maintenance-history/UploadVehicleHistory";
import ManualVehicleHistory from "./maintenance-history/ManualVehicleHistory";
import AddVehicle from "./garage/AddVehicle";
import RemoveVehicle from "./garage/RemoveVehicle";
import {Settings} from "./Settings";

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

        <Route path="/garage/vehicle-info/:vehicle" element={<VehicleInfo />} />
        <Route path="/garage/vehicle-history/:vehicle" element={<VehicleHistory />}  />
        <Route path="/garage/vehicle-history/upload" element={<UploadVehicleHistory />} />
        <Route path="/garage/vehicle-history/manual" element={<ManualVehicleHistory />} />

        <Route path="/settings" element={<Settings />}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;