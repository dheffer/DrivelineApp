import {BrowserRouter, Routes, Route, Link, useNavigate, useParams} from "react-router-dom";
import AddRemoveNavbar from "./AddRemoveNavbar";
import VehicleInfo from "../vehicle/VehicleInfo";
import Accordion from 'react-bootstrap/Accordion';
import {Button, Card, Col, Row} from "react-bootstrap";
import Container from 'react-bootstrap/Container';

function Garage() {
    // TODO: REPLACE WITH REAL VALUES, THESE ARE USED AS TEST VALUES
    const vehicles = ["2009 Nord Campy", "2015 Yotota Bav", "2019 Pesla Godel3", "2014 Nord Bustang",
     "2017 Yotota Camry", "2016 Pesla GodelS", "2018 Nord Bustang", "2010 Yotota Bav"]
    let length = 0;
  return (
      <div>
          <AddRemoveNavbar/>
          <Routes>
              <Route path="/garage/add"/>
              <Route path="/garage/remove"/>
              <Route path={"/garage/vehicle-info/:vehicle"} element={<VehicleInfo />} />
          </Routes>

          <Row xs={1} md={3} className="g-4">
              {vehicles.map((vehicle,id) => {
                  let param = vehicle.replaceAll(" ", "-").toLowerCase();
                  let year = vehicle.split(" ")[0];
                  let model = vehicle.split(" ")[1]
                  let make = vehicle.split(" ")[2];
                  model = model[0].toUpperCase() + model.slice(1);
                  make = make[0].toUpperCase() + make.slice(1);
                  if (length === 2) {
                      length = 0
                  }
                  length++;
                  return (
                      <Card style={{ width: '18rem' }} id={id+""}>
                          <Card.Img variant="top" src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png" />
                          <Card.Body>
                              <Card.Title>{vehicle}</Card.Title>
                              <Card.Text>
                                  Some quick example text to build on the card title and make up the
                                  bulk of the card's content.
                              </Card.Text>
                              <Link to={"/garage/vehicle-info/"+param} ><Button variant="primary">View Info</Button></Link>
                          </Card.Body>
                      </Card>
                  )
              })}
          </Row>
      </div>
  );
}

export default Garage;