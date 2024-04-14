import {Routes, Route, useLocation} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import UploadNavbar from "../maintenance-history/UploadNavbar";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Alert, Form, InputGroup, Container, Row, Col, Table } from "react-bootstrap";
import ManualVehicleHistory from "../maintenance-history/ManualVehicleHistory";

function VehicleHistory(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { configId } = location.state;

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [maintenance, setMaintenance] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [user, setUser] = useState("Loading...");

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
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`/api/get-vehicle-info?configId=${configId}`, reqOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((info) => {
                setVehicleInfo(info);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        fetch(`/api/get-vehicle-history?configId=${configId}`, reqOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((maintenanceData) => {
                setMaintenance(maintenanceData[0]);
                setLoading(false);
                setRefreshData(!refreshData)
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, [refreshData]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <h2>
        <span onClick={() => navigate('/garage')} style={{ cursor: 'pointer', color: '#644A77', fontWeight: 'bold' }}>
            {user} Garage
        </span>
                    <span style={{ color: '#644A77', fontWeight: 'normal' }}> {' > '} </span>
                    {vehicleInfo ? (
                        <span onClick={() => navigate(`/garage/vehicle-info/${configId}`, {state: {configId}})}
                              style={{ cursor: 'pointer', color: '#644A77', fontWeight: 'bold' }}>
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </span>
                    ) : (
                        <span style={{ color: '#644A77', fontWeight: 'normal' }}> Loading Vehicle Info...</span>
                    )}
                    <span style={{ color: '#644A77', fontWeight: 'normal' }}> {' > '} Maintenance History</span>
                </h2>
            </Row>

            <Row className="mb-3">
                <Col md={12}>
                    <ManualVehicleHistory configId={configId} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th scope="col">Action</th>
                            <th scope="col">Part</th>
                            <th scope="col">Cost</th>
                            <th scope="col">Date</th>
                            <th scope="col">Edit/Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {maintenance != null ?
                            maintenance.completed_maintenance.map((service, index) => (
                                <tr key={index}>
                                    <td>{service.type}</td>
                                    <td>{service.maintenance}</td>
                                    <td>${parseFloat(service.cost).toFixed(2)}</td>
                                    <td>{service.date}</td>
                                    <td>
                                            <span className="me-2">
                                                <UpdateMaintenanceHistory
                                                    maintenanceInfo={service}
                                                    configId={configId}
                                                    setRefreshData={setRefreshData}
                                                    buttonVariant="secondary"
                                                />
                                            </span>
                                        <DeleteMaintenanceHistory
                                            maintenanceInfo={service}
                                            configId={configId}
                                            setRefreshData={setRefreshData}
                                            buttonVariant="danger"
                                        />
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5">No maintenance history!</td></tr>
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

function UpdateMaintenanceHistory(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const typeText = useRef();
    const dateText = useRef();
    const maintenanceText = useRef();
    const costText = useRef();
    const submit = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        const raw = JSON.stringify({
            "old_type": props.maintenanceInfo.type,
            "old_date": props.maintenanceInfo.date,
            "old_maintenance": props.maintenanceInfo.maintenance,
            "old_cost": props.maintenanceInfo.cost,
            "new_type": typeText.current.value !== "" ? typeText.current.value : props.maintenanceInfo.type,
            "new_date": dateText.current.value !== "" ? dateText.current.value : props.maintenanceInfo.date,
            "new_maintenance": maintenanceText.current.value !== "" ? maintenanceText.current.value : props.maintenanceInfo.maintenance,
            "new_cost": costText.current.value !== "" ? parseInt(costText.current.value) : parseInt(props.maintenanceInfo.cost)
        });
        const reqOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`/api/update-maintenance-history?configId=${props.configId}`, reqOptions)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setRefreshData(!refreshData);
                window.location.reload();
            })
            .catch((error) => console.error(error));
        handleClose();
    }

    return (
        <>
            <Button onClick={handleShow} variant={props.buttonVariant}>Edit</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Maintenance History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Type</InputGroup.Text>
                                            <Form.Select type="as" defaultValue={props.maintenanceInfo.type}
                                                         ref={typeText} required>
                                                <option value="Replaced">Replaced</option>
                                                <option value="Repaired">Repaired</option>
                                                <option value="Adjusted">Adjusted</option>
                                                <option value="Inspected">Inspected</option>
                                                <option value="Rotated">Rotated</option>
                                                <option value="Aligned">Aligned</option>
                                                <option value="Flushed">Flushed</option>
                                                <option value="Calibrated">Calibrated</option>
                                                <option value="Reset">Reset</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Date</InputGroup.Text>
                                            <Form.Control type="date" placeholder={props.maintenanceInfo.date}
                                                          ref={dateText} required/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Service</InputGroup.Text>
                                            <Form.Control type="text" placeholder={props.maintenanceInfo.maintenance}
                                                          ref={maintenanceText} required/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Cost</InputGroup.Text>
                                            <Form.Control type="number" placeholder={props.maintenanceInfo.cost}
                                                          ref={costText} required/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className={'mx-auto'}>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="success" onClick={submit}>Save changes</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

function DeleteMaintenanceHistory(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        const raw = JSON.stringify({
            "type": props.maintenanceInfo.type,
            "date": props.maintenanceInfo.date,
            "maintenance": props.maintenanceInfo.maintenance,
            "cost": props.maintenanceInfo.cost
        });

        const reqOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`/api/delete-maintenance-history?configId=${props.configId}`, reqOptions)
            .then((response) => response.text())
            .then((result) => {
                setRefreshData(!refreshData);
                window.location.reload();
            })
            .catch((error) => console.error(error));

        handleClose();
    };

    return (
        <>
            <Button onClick={handleShow} variant={props.buttonVariant}>Remove</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={'text-justify-center'}>
                        <Alert key={'danger'} variant={'danger'} className={'text-justify'}>Deletion is irreversible.</Alert>
                    </Modal.Body>
                    <Modal.Footer className={'mx-auto'}>
                        <Button variant="secondary" onClick={handleClose}>No, take me back.</Button>
                        <Button variant="primary" onClick={handleDelete}>Yes, I am sure.</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

export default VehicleHistory;
