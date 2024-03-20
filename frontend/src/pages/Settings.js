import { useState } from 'react';
import ReactDOM from 'react-dom';

export const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');
    const [colorBlindness, setColorBlindness] = useState('normal');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Settings</h1>
            <form>
                <h3>General</h3>
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

                <h3>Accessibility</h3>

                <h4>Color Blind Filter</h4>
                <label>
                    <input type="radio" id="normal" name="colorBlindness" value="normal"
                    onClick={() => setColorBlindness('normal')} />No Filter
                    <input type="radio" id="deuteranopia" name="colorBlindness" value="deuteranopia"
                    onClick={() => setColorBlindness('deuteranopia')} />Deuteranopia
                    <input type="radio" id="protanopia" name="colorBlindness" value="protanopia"
                    onClick={() => setColorBlindness('protanopia')} />Protanopia
                    <input type="radio" id="tritanopia" name="colorBlindness" value="tritanopia"
                    onClick={() => setColorBlindness('tritanopia')} />Tritanopia
                </label>
            </form>
        </div>
    );
}

export default Settings;