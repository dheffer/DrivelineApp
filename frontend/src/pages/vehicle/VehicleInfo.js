import {Routes, Route, useLocation} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import {Badge, Card, Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";

function VehicleInfo() {
    const location = useLocation();
    const { configId } = location.state;

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [info, setInfo] = useState(null);

    useEffect(() => {
        const myHeaders = new Headers();
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch('/api/get-vehicle-info?configId='+configId, reqOptions)
            .then( (res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log();
                return res.json();
            })
            .then( (vehicle) => {
                setInfo(vehicle);
                setLoading(false);
                })
            .catch( (error) => {
                console.error('There has been a problem with your fetch operation:', error);
                });
    });


    return (
        <div className="container">
            <VehicleNavbar/>
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle/*" />
                <Route path="/garage/vehicle-history/:vehicle/*" />
            </Routes>
            <div className="row mt-3">
                <div className="col-md-1 order-md-1" />
                <div className="col-md-10 order-md-2">
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                <Badge bg="secondary">{info != null ? info.year : "Loading..."}</Badge> {info != null ? info.make+" "+info.model : "Loading..."}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Text>Year: {info != null ? info.year : "Loading..."}</Card.Text>
                                    <Card.Text>Make: {info != null ? info.make : "Loading..."}</Card.Text>
                                    <Card.Text>Model: {info != null ? info.model : "Loading..."}</Card.Text>
                                    <Card.Text>Engine: {info != null ? info.engine : "Loading..."}</Card.Text>
                                    <Card.Text>Transmission: {info != null ? info.transmission : "Loading..."}</Card.Text>
                                    <Card.Text>Config ID: {info != null ? info.config_id: "Loading..."}</Card.Text>
                                </Col>
                                <Col>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? info.state : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? info.registration : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                    <Card.Text>x: {info != null ? null : "Loading..."}</Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-1 order-md-3" />
            </div>
        </div>
    );
}

export default VehicleInfo;