import Button from "react-bootstrap/Button";
import {Link, useLocation} from "react-router-dom";
import { useNavigate} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {Alert, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useRef, useState} from "react";

function ManualVehicleHistory(props) {

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
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        const raw = JSON.stringify({
            "type": typeText.current.value,
            "date": dateText.current.value,
            "maintenance": maintenanceText.current.value,
            "cost": parseInt(costText.current.value)
        });
        const reqOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/api/add-maintenance-history?config_id="+props.configId, reqOptions)
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
            <Button onClick={handleShow} style={{ backgroundColor: '#5E989C', borderColor: '#5E989C' }}>Add Maintenance History</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Maintenance Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Type</InputGroup.Text>
                                            <Form.Select type="as" ref={typeText} required>
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
                                            <Form.Control type="date" defaultValue={"yyyy-mm-dd"}
                                                          ref={dateText} required/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Part</InputGroup.Text>
                                            <Form.Control type="text" placeholder={""}
                                                          ref={maintenanceText} required/>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>Cost</InputGroup.Text>
                                            <Form.Control type="number" placeholder={"0.00"}
                                                          ref={costText} required/>
                                        </InputGroup>
                                    </Col>
                                </Row>

                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className={'mx-auto'}>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button style={{backgroundColor: '#5E989C', borderColor: '#5E989C'}} onClick={submit}>Upload</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}

export default ManualVehicleHistory;