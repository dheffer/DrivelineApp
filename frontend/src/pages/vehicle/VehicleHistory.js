import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import UploadNavbar from "../maintenance-history/UploadNavbar";

function VehicleHistory() {
    let { vehicle } = useParams();
    let parsed = vehicle.replaceAll("-", " ");
    let year = parsed.split(" ")[0];
    let model = parsed.split(" ")[1]
    let make = parsed.split(" ")[2];
    model.charAt(0).toUpperCase();
    make.charAt(0).toUpperCase();
    return (
        <div>
            <VehicleNavbar />
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle" />
                <Route path="/garage/vehicle-history/:vehicle" />
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