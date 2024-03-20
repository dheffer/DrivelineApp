import { useState } from 'react';
import ReactDOM from 'react-dom';

export const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Settings</h1>
            <form>
                <label>
                    <input type="checkbox" id="darkMode" name="darkMode" value="darkMode"
                    onChange={() => setDarkMode(!darkMode)} />
                    Dark Mode
                </label>
                <br/>

                <label>
                    <input type="checkbox" id="notifications" name="notifications" value="notifications"
                    onChange={() => setNotifications(!notifications)} />
                    Notifications
                </label>
                <br/>

                <label>
                    <select id="unitOfMeasurement" name="unitOfMeasurement"
                    onChange={(e) => setUnitOfMeasurement(e.target.value)} >
                        <option value="metric">Metric</option>
                        <option value="imperial">Imperial</option>
                    </select>
                    Unit of Measurement
                </label>
                <br/>
            </form>
        </div>
    );
}

export default Settings;