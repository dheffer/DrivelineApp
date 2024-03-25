import {Link, useParams} from "react-router-dom";

function VehicleNavbar() {
    let { vehicle } = useParams();
    let param = vehicle.replaceAll(" ", "-").toLowerCase();

    return (
        <div>
            <Link to={"/garage/vehicle-info/"+param}>Info</Link>
            <Link to={"/garage/vehicle-history/"+param} >History</Link>
        </div>
    );
}

export default VehicleNavbar;