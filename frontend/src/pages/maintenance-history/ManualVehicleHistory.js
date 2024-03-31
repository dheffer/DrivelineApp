import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import { useNavigate} from "react-router-dom";

function ManualVehicleHistory() {
    let navigate = useNavigate();

    return (
        <div>
            <h1>Manual Vehicle History</h1>
            <p>Uh oh! This page isn't finished yet!</p>
            <Button onClick={() => navigate(-1)}>
                Go Back
            </Button>
        </div>
    )
}

export default ManualVehicleHistory;