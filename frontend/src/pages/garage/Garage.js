import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import VehicleInfo from "../vehicle/VehicleInfo";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Vehicle from "./Vehicle";
import '../../App.css';

function Garage(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("Loading...");
    const navigate = useNavigate();
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const firstName = data.name.split(' ')[0];
                        setUser(`${firstName}'s`);
                    } else {
                        console.error("User not found");
                        setUser("User's");
                    }
                }
            } catch (error) {
                console.error(error);
                setUser("User's");
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const myHeaders = new Headers();
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch('/api/get-user-vehicles', reqOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(vehicles => {
                props.setInfo(vehicles);
                setLoading(false);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, [refreshData]);

    const updateOdometer = async (configID, email) => {
        try{
            const response = await fetch("/api/update-odometer", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicle_config_ids : configID,
                    email: email,
                    //odometer: odometer
                })
            });
            if(response.ok){
                setRefreshData(!refreshData);
            }
            else{
                console.error("Failed to update Odometer");
            }
        }
        catch (error){
            console.error("Catch Failed to update Odometer");
        }
    }

    let vehicle_count = 0;

    return (
        <Contatiner className="mt-5">
            <Row className="mb-4 justify-content-between align-items-center">
                <Col>
                    <h2 className="d-inline-block mr-4" onClick={()=> navigate('/garage')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        {user} Garage
                    </h2>
                    <Link to="/garage/add" className="btn btn-primary" style={{verticalAlign: 'baseline', marginLeft: '10px'}}>
                        Add New Vehicle
                    </Link>
                </Col>
            </Row>
            <Row>
                {props.info ? props.info.map((vehicle, index) => (
                    <Col key={index} xs={12} md={4} className="mb-4">
                        <Vehicle vehicle={vehicle} id={index} />
                    </Col>
                )) : !loading && <Col>No vehicles found.</Col>}
            </Row>
            <Row>
                <Col md={{ span: 10, offset: 1 }}>
                    <div className="d-flex justify-content-evenly">
                        <Link to="/garage/add" className={"pb-2"}><Button>Add Vehicle</Button></Link>
                    </div>
                </Col>
            </Row>
        </Contatiner>
    );
}

export default Garage;