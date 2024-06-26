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
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

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
                setRefreshData(false)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, [refreshData]);

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <h2 onClick={() => navigate('/garage')}
                        style={{cursor: 'pointer', color: '#644A77', fontWeight: 'bold'}}>
                        {user} Garage
                    </h2>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="text-start">
                    <Link to="/garage/add" className="btn btn-primary" style={{ backgroundColor: '#5E989C', borderColor: '#5E989C' }}>
                        Add New Vehicle
                    </Link>
                </Col>
            </Row>
            <Row>
                {props.info && props.info.length > 0 ?
                    props.info.map((vehicle, index) => (
                    <Col key={index} xs={12} md={4} className="mb-4">
                        <Vehicle vehicle={vehicle} id={index} />
                    </Col>)) : <Col>No vehicles found.</Col> }
            </Row>
        </Container>
    );
}

export default Garage;