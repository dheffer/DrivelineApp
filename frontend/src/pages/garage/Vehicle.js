import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

function Vehicle(props) {
    console.log(props.vehicle);
    const v = props.vehicle;

    return (
        <div>
            <Card style={{width: '22rem'}} id={v.configurations.year+v.configurations.make+v.configurations.model}>
                <Card.Img variant="top"
                          src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"/>
                <Card.Body>
                    <Card.Title>{v.configurations.year} {v.configurations.make} {v.configurations.model}</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-around">
                        <Link to={`/garage/vehicle-info/${v.configurations.year}-${v.configurations.make}-${v.configurations.model}`}>
                            <Button className={"btn btn-primary"}>View Info</Button>
                        </Link>
                        <Link to={`/garage/remove/${v.configurations.year}-${v.configurations.make}-${v.configurations.model}`}>
                            <Button>Remove</Button>
                        </Link>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;