import { BrowserRouter, Routes, Route } from "react-router-dom";
import GarageNavbar from "./GarageNavbar";
import UploadNavbar from "./UploadNavbar";

function VehicleHistory() {
    return (
        <div>
            <GarageNavbar />
            <Routes>
                <Route path="/garage/vehicle-info" />
                <Route path="/garage/vehicle-history" />
            </Routes>

            <UploadNavbar />
            <Routes>
                <Route path="/garage/vehicle-history/upload" />
                <Route path="/garage/vehicle-history/manual" />
            </Routes>

            <table>
                <tbody>
                    <tr>
                        <td>Placeholder</td>
                    </tr>
                    <tr>
                        <td>Placeholder</td>
                    </tr>
                    <tr>
                        <td>Placeholder</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}

export default VehicleHistory