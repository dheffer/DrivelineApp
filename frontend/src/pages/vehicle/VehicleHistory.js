import {BrowserRouter, Routes, Route, useParams, useLocation} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import UploadNavbar from "../maintenance-history/UploadNavbar";

function VehicleHistory(props) {
    const location = useLocation();
    const { configId } = location.state;
    return (
        <div className="container">
            <VehicleNavbar/>
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle/*"/>
                <Route path="/garage/vehicle-history/:vehicle/*"/>
            </Routes>

            <UploadNavbar/>
            <Routes>
                <Route path="/garage/vehicle-history/upload"/>
                <Route path="/garage/vehicle-history/manual"/>
            </Routes>
            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">
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
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

export default VehicleHistory