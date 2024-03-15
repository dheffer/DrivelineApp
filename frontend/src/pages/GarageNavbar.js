import {Link} from "react-router-dom";

function GarageNavbar() {
    return (
        <div>
            <Link to="/garage/vehicle-info">Info</Link>
            <Link to="/garage/vehicle-history">History</Link>
        </div>
    );
}

export default GarageNavbar;