import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Manipulator from "bootstrap/js/src/dom/manipulator";
import ManualVehicleHistory from "./ManualVehicleHistory";

function UploadNavbar(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">
                    <div className="d-flex justify-content-center">
                        <Link to={"/garage/vehicle-history/upload"} className="me-3"
                              onClick={(e) => e.preventDefault()}>
                            <Button variant="primary" disabled>Upload</Button>
                        </Link>
                        <ManualVehicleHistory configId={props.configId}/>
                    </div>
                </div>
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

export default UploadNavbar;