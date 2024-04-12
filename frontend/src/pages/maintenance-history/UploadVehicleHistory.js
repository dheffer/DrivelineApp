import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

/**
 *
 *
 *
 *
 *
 * DELETE THIS FILE?????????????????????????????
 *
 *
 *
 *
 *
 *
 * */

function UploadVehicleHistory() {
    let navigate = useNavigate();

    return (
        <div>
            <h1>Upload Vehicle History</h1>
            <p>Uh oh! This page isn't finished yet!</p>
            <Button onClick={() => navigate(-1)}>
                Go Back
            </Button>
        </div>
    )
}

export default UploadVehicleHistory;