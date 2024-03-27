import {BrowserRouter, Routes, Route, Link, useNavigate, useParams} from "react-router-dom";
import VehicleInfo from "../vehicle/VehicleInfo";
import Accordion from 'react-bootstrap/Accordion';
import {Button, Card, Col, Row} from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import {useEffect, useState} from "react";
import Vehicle from "./Vehicle";

// TODO: REPLACE WITH REAL VALUES, THESE ARE USED AS TEST VALUES


function Garage(props) {
    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const garageVehicles = [];
    if (props.info != null) {
        for (let i = 0; i < props.info.length; i += 3) {
            garageVehicles.push(props.info.slice(i, i + 3));

        }
    }

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
            .then( vehicles => {
                props.setInfo(vehicles);
                setLoading(false);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, [refreshData]);

    let vehicle_count = 0;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-1 order-md-1"></div>
                <div className="col-md-10 order-md-2">
                    <div className="d-flex justify-content-evenly">
                        <Link to="/garage/add" className={"pb-2"}><Button>Add Vehicle</Button></Link>
                        <Routes>
                            <Route path="/garage/add"/>
                            <Route path="/garage/remove/:vehicle"/>
                            <Route path={"/garage/vehicle-info/:vehicle"} element={<VehicleInfo/>}/>
                        </Routes>
                    </div>

                    {
                        props.info != null ?
                        props.info.map((vehicle, index) => {
                            //console.log(garageVehicles[0][0].configurations.year);
                            vehicle_count++;
                            if (vehicle_count === 1 || vehicle_count % 3 === 0) {
                                return (
                                    <Row key={index} xs={1} md={3} className="g-4">
                                        <Col key={vehicle.configurations.name}>
                                            <Vehicle vehicle={vehicle} id={index}/>
                                        </Col>
                                    </Row>
                                )
                            }
                            return (
                                <Col key={vehicle.configurations.name}>
                                    <Vehicle vehicle={vehicle} id={index}/>
                                </Col>
                            )
                        }) : null
                    }
                </div>
                <div className="col-md-1 order-md-3"></div>
            </div>
        </div>
    );
}

export default Garage;