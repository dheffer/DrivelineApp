import { useState } from 'react';
import ReactDOM from 'react-dom';
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

export const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');

    const [visibility, setVisibility] = useState(false);
    const handleVisibilityChange = () => {
        setVisibility(!visibility);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleVisibilityChange} placement="right">Settings</Button>
            <Offcanvas show={visibility}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <label>Dark Mode</label>
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