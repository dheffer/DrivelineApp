import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

function Vehicle(props) {
    console.log(props.vehicle);
    const v = props.vehicle.configurations;
    console.log(v);

    return (
        <div>
            <Card style={{width: '22rem'}} id={v.year+v.make+v.model}>
                <Card.Img variant="top"
                          src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"/>
                <Card.Body>
                    <Card.Title>{v.year} {v.make} {v.model}</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-around">
                        <Link to={`/garage/vehicle-info/${v.year}-${v.make}-${v.model}`}>
                            <Button className={"btn btn-primary"}>View Info</Button>
                        </Link>
                        <Link to={`/garage/remove/${v.year}-${v.make}-${v.model}`}>
                            <Button>Remove</Button>
                        </Link>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;