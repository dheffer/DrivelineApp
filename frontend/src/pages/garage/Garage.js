import {BrowserRouter, Routes, Route, Link, useNavigate, useParams} from "react-router-dom";
import VehicleInfo from "../vehicle/VehicleInfo";
import Accordion from 'react-bootstrap/Accordion';
import {Button, Card, Col, Row} from "react-bootstrap";
import Container from 'react-bootstrap/Container';

// TODO: REPLACE WITH REAL VALUES, THESE ARE USED AS TEST VALUES


function Garage() {
        // Divide the vehicles array into chunks of 3
    const vehicles = ["2009 Nord Campy", "2015 Yotota Bav", "2019 Pesla Godel3", "2014 Nord Bustang"]
    const chunkedVehicles = [];
    let length = 0;
    for (let i = 0; i < vehicles.length; i += 3) {
        chunkedVehicles.push(vehicles.slice(i, i + 3));
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-1 order-md-1"></div>
                <div className="col-md-10 order-md-2">
                    <div className="d-flex justify-content-evenly">
                        <Link to="/garage/add" className={"pb-2"}><Button>Add Vehicle</Button></Link>
                        <Routes>
                            <Route path="/garage/add"/>
                            <Route path="/garage/remove/:vehicle"/>
                            <Route path={"/garage/vehicle-info/:vehicle"} element={<VehicleInfo/>}/>
                        </Routes>
                    </div>

                    {chunkedVehicles.map((row, rowIndex) => (
                        <Row key={rowIndex} xs={1} md={3} className="g-4">
                            {/* Map over vehicles in the current row */}
                            {row.map((vehicle, colIndex) => {
                                let param = vehicle.replaceAll(" ", "-").toLowerCase();
                                let year = vehicle.split(" ")[0];
                                let model = vehicle.split(" ")[1];
                                let make = vehicle.split(" ")[2];
                                model = model[0].toUpperCase() + model.slice(1);
                                make = make[0].toUpperCase() + make.slice(1);

                                return (
                                    <Col key={colIndex}>
                                        <Card style={{width: '22rem'}} id={rowIndex + "-" + colIndex}>
                                            <Card.Img variant="top"
                                                      src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"/>
                                            <Card.Body>
                                                <Card.Title>{vehicle}</Card.Title>
                                                <Card.Text>
                                                    Some quick example text to build on the card title and make up the bulk of
                                                    the card's content.
                                                </Card.Text>
                                                <Card.Footer className="d-flex justify-content-around">
                                                    <Link to={"/garage/vehicle-info/" + param}>
                                                        <Button className={"btn btn-primary"}>View Info</Button>
                                                    </Link>
                                                    <Link to={"/garage/remove/" + param}>
                                                        <Button>Remove</Button>
                                                    </Link>
                                                </Card.Footer>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    ))}
                </div>
                <div className="col-md-1 order-md-3"></div>
            </div>
        </div>
    );
}

export default Garage;