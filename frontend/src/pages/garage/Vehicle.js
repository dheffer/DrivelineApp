import {Badge, Button, Card, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import RemoveVehicle from "./RemoveVehicle";
import {useEffect, useState} from "react";

function Vehicle(props) {
    const [odometerValue, setOdometerValue] = useState(0);
    const [odometerReading, setOdometerReading] = useState([]);

    const EMAIL = process.env.EMAIL;

    useEffect(() => {
        fetchReadings();
    }, []);

    const fetchReadings = async () => {
        try{
            const response = await fetch("/api/get-user-vehicle-odometers");
            if(response.ok){
                const data = await response.json();
                setOdometerReading(data);
            }
            else{
                console.log("Failed to fetch odometer readings");
            }
        }
        catch (e) {
            console.error('There has been a problem with your fetch operation:', e);
        }
    }


    const v = props.vehicle;
    const handleUpdateOdometer = () => {
        console.log("Updating odometer");
        try{
            const response = fetch("/api/update-odometer", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicle_config_ids : v.configurations.config_id,
                    email: EMAIL,
                    odometer: odometerValue
                })
            });
            if(response.ok){
                console.log("Odometer updated");
                fetchReadings();
            }
            else{
                console.log("Odometer update failed");
            }
        }
        catch (e) {
            console.error('There has been a problem with your fetch operation:', e);
        }
    }

    const getOdometer = (config) => {
        const reading = odometerReading.find(vehicle => vehicle.vehicle_config_ids === config);
        return reading ? reading.odometer : -9999;
    }

    return (
        <div>
            <Card style={{width: '22rem'}} id={v.configurations.year+v.configurations.make+v.configurations.model}>
                <Card.Img variant="top"
                          src="https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"/>
                <Card.Body>
                    <Card.Title className={'d-flex justify-content-center'}>{v.configurations.year} {v.configurations.make} {v.configurations.model}</Card.Title>
                    <Card.Text className="d-flex justify-content-around">
                        <Link to={`/garage/vehicle-info/${v.configurations.config_id}`} state={{configId: v.configurations.config_id}}>
                            <Button className={"btn btn-primary"}>View Info</Button>
                        </Link>
                        <RemoveVehicle configId={v.configurations.config_id}/>
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-around">
                        <p><Badge bg='secondary' >CONFIG ID</Badge> {v.configurations.config_id}</p>
                        <p><Badge bg='secondary'>ODOMETER</Badge> {getOdometer(v.configurations.config_id)}</p>
                    </Card.Footer>
                    <Card.Footer className="d-flex justify-content-around">
                        <Form.Group>
                            <Form.Control
                                type="number"
                                placeholder="Enter Odometer Value"
                                value={odometerValue}
                                onChange={e => setOdometerValue(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdateOdometer}>Update Odometer</Button>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;