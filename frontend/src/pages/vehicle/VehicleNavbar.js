import {Link, useLocation, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";

function VehicleNavbar(props) {
    const location = useLocation();
    const { configId } = location.state;
    const infoSelected = props.selected === "info" ? "secondary" : "primary";
    const historySelected = props.selected === "history" ? "secondary" : "primary";

    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <Link to={"/garage/vehicle-info/" + configId}
                      state={{configId: configId}}
                      className="me-3">
                    {<Button variant={infoSelected}>Info</Button>}
                </Link>

                <Link to={"/garage/vehicle-history/" + configId}
                      state={{configId: configId}}
                      className="ml-3">
                    <Button variant={historySelected}>History</Button>
                </Link>
            </div>
            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">

                </div>
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

export default VehicleNavbar;