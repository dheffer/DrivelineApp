import {Badge, Button, Card, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import RemoveVehicle from "./RemoveVehicle";
import {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";

function Vehicle(props) {
    const [odometerValue, setOdometerValue] = useState(0);
    const [odometerReading, setOdometerReading] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [pictureUrl, setPictureUrl] = useState("");
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    console.log("EMAIL: " + email);

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const token = localStorage.getItem('token');
                if(token) {
                    const response = await fetch('/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if(response.ok){
                        const data = await response.json();
                        setEmail(data.email);
                        setUser(data.name);
                        console.log("EMAIL DATA: " + data.email);
                    }
                    else {
                        console.error("User not found");
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        fetchReadings();
    }, []);
    const [user, setUser] = useState('');

    const fetchReadings = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
            myHeaders.append("Content-Type", "application/json");

            const reqOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }
            const response = await fetch("/api/get-user-vehicle-odometers", reqOptions);
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

    const getOdometer = (config) => {
        const reading = odometerReading.find(vehicle => vehicle.config_id === config);
        return reading ? reading.odometer : 'Loading...';
    }

    const getPicture = (config) => {
        const reading = odometerReading.find(vehicle => vehicle.config_id === config);
        return reading ? reading.picture_url : "https://cdn.dealerk.it/cars/placeholder/placeholder-800.png";
    }

    const handleShowModal = () => {
        setShowModal(true);
        setPictureUrl(getPicture(v.configurations.config_id));
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleUpdatePicture = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const reqOptions = {
            method: 'POST',
            headers: myHeaders,
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
                setPictureUrl(data.picture_url)
                window.location.reload();
                // pictureUrl = data.picture_url;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }


    return (
        <div>
            <Card style={{width: '22rem'}} id={v.configurations.year+v.configurations.make+v.configurations.model}>
                <Card.Img variant="top"
                          src={getPicture(v.configurations.config_id) || "https://cdn.dealerk.it/cars/placeholder/placeholder-800.png"}
                          style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                          onClick={handleShowModal}
                />
                <Card.Body>
                    <Card.Title className={'d-flex justify-content-center'}>{v.configurations.year} {v.configurations.make} {v.configurations.model}</Card.Title>
                    <Card.Text className="d-flex justify-content-around">
                        <Link to={`/garage/vehicle-info/${v.configurations.config_id}`} state={{configId: v.configurations.config_id}}>
                            <Button className={"btn btn-primary"}>View Info</Button>
                        </Link>
                        <RemoveVehicle configId={v.configurations.config_id}/>
                    </Card.Text>
                    <Card.Footer className="d-flex justify-content-around">
                        <div className="d-flex flex-column align-items-center">
                            <Badge bg='secondary'>CONFIG ID</Badge>
                            <div>{v.configurations.config_id}</div>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <Badge bg='secondary'>ODOMETER</Badge>
                            <div>{getOdometer(v.configurations.config_id)}</div>
                        </div>
                    </Card.Footer>
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Picture</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId={"formPictureUrl"}>
                                <Form.Label>Picture URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={pictureUrl}
                                    onChange={e => setPictureUrl(e.target.value)}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                            <Button variant="primary" onClick={handleUpdatePicture}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Vehicle;