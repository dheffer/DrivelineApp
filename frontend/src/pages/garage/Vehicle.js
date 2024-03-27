import {Badge, Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import RemoveVehicle from "./RemoveVehicle";

function Vehicle(props) {
    const v = props.vehicle;
    return (
        <div>
            <Card style={{width: '22rem'}} id={v.configurations.year+v.configurations.make+v.configurations.model}>
                <Card.Img variant="top"
                          src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"/>
                <Card.Body>
                    <Card.Title className={'d-flex justify-content-center'}>{v.configurations.year} {v.configurations.make} {v.configurations.model}</Card.Title>
                    <Card.Text className="d-flex justify-content-around">
                        <Link to={`/garage/vehicle-info/${v.configurations.year}-${v.configurations.make}-${v.configurations.model}`}>
                            <Button className={"btn btn-primary"}>View Info</Button>
                        </Link>
                        <RemoveVehicle configId={v.configurations.config_id}/>
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-around">
                        <p><Badge bg='secondary' >CONFIG ID</Badge> {v.configurations.config_id}</p>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;