import {Routes, Route, useLocation, useNavigate, Link} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import {Badge, Card, Col, Row, Button, Container, Table, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";

function VehicleInfo() {
    const location = useLocation();
    const { configId } = location.state;

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [info, setInfo] = useState(null);
    const [maintenance, setMaintenance] = useState(null);

    const [upcomingMaintenance, setUpcomingMaintenance] = useState(null);
    const [odometer, setOdometer] = useState(0);
    const [newOdometerValue, setNewOdometerValue] = useState(0);


    const [user, setUser] = useState("Loading...");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    console.log("email: "+email);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setEmail(data.email);
                        const firstName = data.name.split(' ')[0];
                        setUser(`${firstName}'s`);
                    } else {
                        console.error("User not found");
                        setUser("User's");
                    }
                }
            } catch (error) {
                console.error(error);
                setUser("User's");
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        fetch('/api/get-vehicle-info?config_id=' + configId, reqOptions)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(res);
                return res.json();
            })
            .then(async (vehicle) => {
                setInfo(vehicle);
                return fetch("/api/get-user-vehicle-odometers", reqOptions);
            })
            .then(async (odometerResponse) => {
                if (!odometerResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return odometerResponse.json();
            })
            .then(async (odometerData) => {
                const currentOdometer = odometerData.find( reading => reading.config_id === configId).odometer;
                setOdometer(currentOdometer);
                return fetch(`/api/get-maintenance?config_id=${configId}&odometer=${currentOdometer}`, reqOptions);
            })
            .then(async (maintenanceResponse) => {
                if (!maintenanceResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                return maintenanceResponse.json();
            })
            .then(async (maintenanceData) => {
                console.log("MAINTENANCE DATA: "+JSON.stringify(maintenanceData));
                setMaintenance(maintenanceData);
                setLoading(false);
                setUpcomingMaintenance(maintenanceData.service_schedule_mileage)
            })
            .catch( (error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        fetchReadings();
    }, [configId, refreshData]);

    const fetchReadings = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        try{
            const response = await fetch("/api/get-user-vehicle-odometers", reqOptions);
            if(response.ok){
                const data = await response.json();
                console.log("READINGS "+ JSON.stringify(data));
                setNewOdometerValue(data);
            }
            else{
                console.log("Failed to fetch odometer readings");
            }
        }
        catch (e) {
            console.error('There has been a problem with your fetch operation:', e);
        }
    }

    const handleUpdateOdometer = () => {
        console.log("Updating odometer");
        console.log(configId+ "= config");
        console.log(newOdometerValue+ "= odometer");

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        console.log("ODOMETER EMAIL: "+email);

        const reqOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                config_id : configId,
                email: email,
                odometer: newOdometerValue,
            }),
            redirect: 'follow'
        };
        console.log("reqOptions " + reqOptions);

        fetch('/api/update-odometer', reqOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log("Odometer Updated! "+data);
                fetchReadings();
                setNewOdometerValue(0);
                setRefreshData(!refreshData);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }


    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <h2 onClick={() => navigate('/garage')}
                        style={{cursor: 'pointer', color: '#644A77', fontWeight: 'bold'}}>
                        {user} Garage
                        <span style={{fontWeight: 'normal', color: '#644A77'}}> >
                        {info ? ` ${info.year} ${info.make} ${info.model}` : ' Loading Vehicle Info...'}
                    </span>
                    </h2>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="text-start">
                    <Button variant="primary"
                            onClick={() => navigate(`/garage/vehicle-history/${configId}`, {state: {configId}})}>
                        View Maintenance History
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={5}>
                    <Card>
                        <Card.Header style={{backgroundColor: '#644A77', color: '#FFFFFF', fontSize: '1.25rem'}}>Vehicle
                            Specifications</Card.Header>
                        <Card.Body className="text-left" style={{fontSize: '1.1rem'}}>
                            {info ? (
                                <>
                                    <p><strong>Year:</strong> {info.message.year}</p>
                                    <p><strong>Make:</strong> {info.message.make}</p>
                                    <p><strong>Model:</strong> {info.message.model}</p>
                                    <p><strong>Engine:</strong> {info.message.engine}</p>
                                    <p><strong>Transmission:</strong> {info.message.transmission}</p>
                                    <p><strong>Odometer:</strong> {odometer ? `${odometer} miles` : "0 miles"}</p>
                                </>
                            ) : "Loading vehicle specifications..."}
                        </Card.Body>
                    </Card>
                    <Card className="mt-3">
                        <Card.Header style={{backgroundColor: '#644A77', color: '#FFFFFF', fontSize: '1.25rem'}}>Update Vehicle Odometer</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group as={Row} className="mb-3 justify-content-center">
                                    <Col sm="8">
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter new odometer reading"
                                            value={newOdometerValue}
                                            onChange={(e) => setNewOdometerValue(e.target.value)}
                                            style={{textAlign: 'center'}}
                                        />
                                    </Col>
                                </Form.Group>
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" onClick={handleUpdateOdometer}>Update Odometer</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card>
                        <Card.Header style={{backgroundColor: '#644A77', color: '#FFFFFF', fontSize: '1.25rem'}}>Upcoming Maintenance Procedures | Due at: {upcomingMaintenance ? upcomingMaintenance + ' miles' : 'Loading...'}</Card.Header>
                        <Card.Body className="text-left" style={{fontSize: '1.1rem'}}>
                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Part</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    maintenance !== null ? maintenance.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.action ? task.action : 'Loading...'}</td>
                                        <td>{task.part}</td>
                                    </tr>
                                    )) : <tr>
                                            <td>Loading...</td>
                                            <td>Loading...</td>
                                            </tr>
                                }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default VehicleInfo;