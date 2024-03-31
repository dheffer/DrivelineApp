import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

function UploadNavbar() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">
                    <div className="d-flex justify-content-center">
                        <Link to={"/garage/vehicle-history/upload"} className="me-3">
                            <Button variant="primary">Upload</Button>
                        </Link>

                        <Link to={"/garage/vehicle-history/manual"} className="ml-3">
                            <Button variant="primary">Manual</Button>
                        </Link>
                    </div>
                </div>
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

export default UploadNavbar;