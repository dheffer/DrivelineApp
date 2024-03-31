import {BrowserRouter, Routes, Route, useParams, useLocation} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import UploadNavbar from "../maintenance-history/UploadNavbar";
import {useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {Alert, Col, Form, InputGroup, Row} from "react-bootstrap";

function VehicleHistory(props) {
    const location = useLocation();
    const { configId } = location.state;

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [maintenance, setMaintenance] = useState(null);

    useEffect(() => {
        const myHeaders = new Headers();
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch('/api/get-vehicle-history?configId='+configId, reqOptions)
            .then( (res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then( (maintenance) => {
                setMaintenance(maintenance[0]);
                setLoading(false);
            })
            .catch( (error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, []);

    return (
        <div className="container">
            <VehicleNavbar selected={"history"}/>
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle/*"/>
                <Route path="/garage/vehicle-history/:vehicle/*"/>
            </Routes>

            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10 mt-4">
                            <Row>
                                <Col>
                                    <h1>Vehicle History</h1>
                                </Col>
                                <Col>
                                    <UploadNavbar/>
                                    <Routes>
                                        <Route path="/garage/vehicle-history/upload"/>
                                        <Route path="/garage/vehicle-history/manual"/>
                                    </Routes>
                                </Col>
                                <Col/>
                            </Row>

                        </div>
                        <div className="col-md-1"/>
                    </div>
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th/>
                                    <th scope="col">Type</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Service</th>
                                    <th scope="col">Cost</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    maintenance != null ?
                                        maintenance.completed_maintenance.map((service, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td><UpdateMaintenanceHistory maintenanceInfo={service} /></td>
                                                    <td>{service.type}</td>
                                                    <td>{service.date}</td>
                                                    <td>{service.maintenance}</td>
                                                    <td>{service.cost}</td>
                                                    <td><DeleteMaintenanceHistory maintenanceInfo={service}/></td>
                                                </tr>
                                            )
                                        }) : <tr>
                                            <td colSpan="4">No maintenance history!</td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                </div>
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

function UpdateMaintenanceHistory(props) {

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

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

        fetch("/api/update-maintenance-history", reqOptions)
            .then((res) =>
                res.json())
            .then((result) => {
                console.log(result);
                setRefreshData(!refreshData);
            })
            .catch((error) => console.error(error));
        handleClose();
    }

    return (
        <>
            <Button onClick={handleShow}>Edit</Button>
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
                                            <Form.Control type="text" placeholder={props.maintenanceInfo.type}
                                                          ref={typeText} required/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Date</InputGroup.Text>
                                            <Form.Control type="text" placeholder={props.maintenanceInfo.date}
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
                                            <Form.Control type="text" placeholder={props.maintenanceInfo.cost}
                                                          ref={costText} required/>
                                        </InputGroup>
                                    </Col>
                                </Row>

                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={submit}>Save changes</Button>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

function DeleteMaintenanceHistory(props) {
    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleDelete = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

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

        fetch("/api/delete-maintenance-history", reqOptions)
            .then((response) => response.text())
            .then((result) => {
                setRefreshData(!refreshData);
            })
            .catch((error) => console.error(error));

        handleClose();
    };

    return (
        <>
            <Button onClick={handleShow} variant="danger">Remove</Button>
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
    )
}

export default VehicleHistory