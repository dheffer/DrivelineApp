import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Garage from "./garage/Garage";
import VehicleInfo from "./vehicle/VehicleInfo";
import VehicleHistory from "./vehicle/VehicleHistory";
import UploadVehicleHistory from "./maintenance-history/UploadVehicleHistory";
import ManualVehicleHistory from "./maintenance-history/ManualVehicleHistory";
import AddVehicle from "./garage/AddVehicle";
import {Settings} from "./Settings";
import {useState} from "react";

const ProtectedRoute = () => {
  const authenticated = localStorage.getItem('token') !== null;
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  const [garageInfo, setGarageInfo] = useState();
  const [configId, setConfigId] = useState();

  return (
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path= "/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/garage" element={<Garage info={garageInfo} setInfo={setGarageInfo} />} />
              <Route path="/garage/add" element={<AddVehicle />} />
              <Route path="/garage/vehicle-info/:vehicle/*" element={<VehicleInfo configId={configId} setConfig={setConfigId}/>} />
              <Route path="/garage/vehicle-history/:vehicle/*" element={<VehicleHistory configId={configId} setConfig={setConfigId}/>} />
              <Route path="/garage/vehicle-history/upload" element={<UploadVehicleHistory />} />
              <Route path="/garage/vehicle-history/manual" element={<ManualVehicleHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
  )
}

export default App;