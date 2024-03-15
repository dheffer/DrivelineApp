import { BrowserRouter, Routes, Route } from "react-router-dom";
import GarageNavbar from "./GarageNavbar";

function VehicleInfo() {
    return (
        <div>
            <GarageNavbar />
            <Routes>
                <Route path="/garage/vehicle-info" />
                <Route path="/garage/vehicle-history" />
            </Routes>

            <p>Image</p>
            <p>Year, Make, Model</p>
            <p>Upcoming Maintenance / Odometer</p>

        </div>
    );
}

export default VehicleInfo;