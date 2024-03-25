import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

export const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Settings</Button>
            <Offcanvas show={show} onHide={handleShow} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Settings</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <label >Dark Mode</label>
                        <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)}/>
                    </div>
                    <div>
                        <label>Notifications</label>
                        <input type="checkbox" checked={notifications}
                               onChange={(e) => setNotifications(e.target.checked)}/>
                    </div>
                    <div>
                        <label>Unit of Measurement</label>
                        <select value={unitOfMeasurement} onChange={(e) => setUnitOfMeasurement(e.target.value)}>
                            <option value="metric">Metric</option>
                            <option value="imperial">Imperial</option>
                        </select>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </div>
    );
}

export default Settings;