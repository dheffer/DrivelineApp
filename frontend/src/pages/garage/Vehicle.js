import {Badge, Button, Card, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import RemoveVehicle from "./RemoveVehicle";
import {useEffect, useState} from "react";

function Vehicle(props) {
    const [odometerValue, setOdometerValue] = useState(0);
    const [odometerReading, setOdometerReading] = useState([]);
    const [pictureUrl, setPictureUrl] = useState("");
    const email = process.env.EMAIL;

    useEffect(() => {
        fetchReadings();
    }, []);

    const fetchReadings = async () => {
        try{
            const response = await fetch("/api/get-user-vehicle-odometers");
            if(response.ok){
                const data = await response.json();
                console.log("READINGS "+ JSON.stringify(data));
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
        console.log(v.configurations.config_id+ "= config");
        console.log(odometerValue+ "= odometer");

        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config_id : v.configurations.config_id,
                email: email,
                odometer: odometerValue,
            }),
            redirect: 'follow'
        };
        console.log("reqOptions " + reqOptions);

        fetch('/api/update-odometer', reqOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log("Odometer Updated! "+data);
                fetchReadings();
                setOdometerValue(0);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        }

    const getOdometer = (config) => {
        const reading = odometerReading.find(vehicle => vehicle.config_id === config);
        return reading ? reading.odometer : -9999;
    }
    
    const getPicture = (config) => {
        const reading = odometerReading.find(vehicle => vehicle.config_id === config);
        return reading ? reading.picture_url : "https://cdn.dealerk.it/cars/placeholder/placeholder-800.png";
    }


    const handleUpdatePicture = () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config_id : v.configurations.config_id,
                email: email,
                picture_url: pictureUrl
            }),
            redirect: 'follow'
        };
        fetch('/api/update-odometer', reqOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log("Picture Updated! "+data);
                pictureUrl = data.picture_url;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }


    return (
        <div>
            <Card style={{width: '22rem'}} id={v.configurations.year+v.configurations.make+v.configurations.model}>
                <Card.Img variant="top"
                          src={getPicture(v.configurations.config_id) || "https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"}/>
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
                        <Button variant="primary" size="sm" onClick={handleUpdateOdometer}>Update Odometer</Button>
                    </Card.Footer>
                    <Card.Footer className="d-flex justify-content-around">
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter a Picture URL"
                                value={pictureUrl}
                                onChange={e => setPictureUrl(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" size="sm" onClick={handleUpdatePicture}>Update Picture</Button>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;