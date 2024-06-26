import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Col, Nav, Row} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {GearFill} from "react-bootstrap-icons";

export const Settings = (props) => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    }

    return (
        <div>
            {/*<Button variant="primary" onClick={handleShow}>Settings</Button>*/}

            <Nav.Link onClick={handleShow} className="align-items-center">
                <Row>
                    <Col lg="auto">
                        {props.greeting}
                    </Col>
                    <Col>
                        { props.greeting === ' ' ? <></> : <GearFill className=".pe-2" />}
                    </Col>
                </Row>
            </Nav.Link>
            <Offcanvas show={show} onHide={handleShow} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Settings</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <label className={"pe-1"}>Dark Mode </label>
                        <input type="checkbox" checked={darkMode}
                               disabled
                               onChange={(e) => setDarkMode(!darkMode)}/>
                    </div>
                    <div>
                        <label className={"pe-1"}>Notifications </label>
                        <input type="checkbox" checked={notifications}
                               disabled
                               onChange={(e) => setNotifications(!notifications)}/>
                    </div>
                    <div>
                        <label className={"pe-1"}>Unit of Measurement</label>
                        <select value={unitOfMeasurement} disabled
                                onChange={(e) => setUnitOfMeasurement(e.target.value)}>
                            <option value="metric">Metric</option>
                            <option value="imperial">Imperial</option>
                        </select>
                    </div>
                    <div className={"mt-3"}>
                        <Button variant="primary" onClick={handleLogout}>Logout</Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default Settings;