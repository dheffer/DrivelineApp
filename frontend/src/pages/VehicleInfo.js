import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
import GarageNavbar from "./GarageNavbar";

function VehicleInfo() {
    let { vehicle } = useParams();
    let parsed = vehicle.replaceAll("-", " ");
    let year = parsed.split(" ")[0];
    let model = parsed.split(" ")[1]
    let make = parsed.split(" ")[2];
    model = model[0].toUpperCase() + model.slice(1);
    make = make[0].toUpperCase() + make.slice(1);
    return (
        <div>
            <GarageNavbar />
            <Routes>
                <Route path="/garage/vehicle-info" />
                <Route path="/garage/vehicle-history" />
            </Routes>

            <p>{year} {model} {make}</p>

        </div>
    );
}

export default VehicleInfo;