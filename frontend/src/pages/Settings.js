import {Link, Routes, Route} from "react-router-dom";


export const Settings = () => {
    return (
        <div>
            <h1>Settings</h1>
            <form>
                <h3>General</h3>
                <label>
                    <input type="checkbox" id="darkMode" name="darkMode" value="darkMode"/>
                    Dark Mode
                </label>
                <br/>

                <label>
                    <input type="checkbox" id="notifications" name="notifications" value="notifications"/>
                    Notifications
                </label>
                <br/>

                <label>
                    <select id="unitOfMeasurement" name="unitOfMeasurement">
                        <option value="imperial">Imperial</option>
                        <option value="metric">Metric</option>
                    </select>
                    Unit of Measurement
                </label>
                <br/>

                <h3>Accessibility</h3>

                <h4>Color Blind Filter</h4>
                <label>
                    <input type="radio" id="normal" name="colorBlindness" value="normal"/>No Filter
                    <input type="radio" id="deuteranopia" name="colorBlindness" value="deuteranopia"/>Deuteranopia
                    <input type="radio" id="protanopia" name="colorBlindness" value="protanopia"/>Protanopia
                    <input type="radio" id="tritanopia" name="colorBlindness" value="tritanopia"/>Tritanopia
                </label>
            </form>
        </div>
    );
}

export default Settings;