import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import {Card, Col, Row} from "react-bootstrap";

function VehicleInfo() {
    let { vehicle } = useParams();
    let parsed = vehicle.replaceAll("-", " ");
    let year = parsed.split(" ")[0];
    let model = parsed.split(" ")[1]
    let make = parsed.split(" ")[2];
    model = model[0].toUpperCase() + model.slice(1);
    make = make[0].toUpperCase() + make.slice(1);
    return (
        <div>
            <VehicleNavbar />
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle" />
                <Route path="/garage/vehicle-history/:vehicle" />
            </Routes>

            <p>{year} {model} {make}</p>

        </div>
    );
}

export default VehicleInfo;



<Row xs={1} md={2} className="g-4">
    {Array.from({ length: 4 }).map((_, idx) => (
        <Col key={idx}>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" />
                <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a longer card with supporting text below as a natural
                        lead-in to additional content. This content is a little bit
                        longer.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    ))}
</Row>