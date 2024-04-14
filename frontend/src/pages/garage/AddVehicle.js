import React, { useEffect, useState } from "react";
// import { Button, Form } from 'react-bootstrap';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../../App.css';
import {useNavigate} from "react-router-dom";
function AddVehicle() {

    const [refreshData, setRefreshData] = useState(false);
    const [email, setEmail] = useState("");

    const [vehicleAdded, setVehicleAdded] = useState(false);
    const [configId, setConfigId] = useState(null);
    const [dropdownValues, setDropdownValues] = useState({
        years: [],
        makes: [],
        models: [],
        engines: [],
        transmissions: []
    });
    const [selectedVehicle, setSelectedVehicle] = useState({
        year: "",
        make: "",
        model: "",
        engine: "",
        transmission: ""
    });

    const [user, setUser] = useState("Loading...");
    const navigate = useNavigate();

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
                        setEmail(data.email);
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
    }, [refreshData]);

    useEffect(() => {
        getDropdownValues('years');
    }, []);

    const handleChange = async (e) => {
        const {name, value} = e.target;
        setSelectedVehicle(prevSelectedVehicle => ({
            ...prevSelectedVehicle,
            [name]: value
        }));

        if (name === 'year') {
            getDropdownValues('makes', value);
            setDropdownValues(prev => ({...prev, models: [], engines: [], transmissions: []}));
        } else if (name === 'make') {
            getDropdownValues('models', selectedVehicle.year, value);
            setDropdownValues(prev => ({...prev, engines: [], transmissions: []}));
        } else if (name === 'model') {
            getDropdownValues('engines', selectedVehicle.year, selectedVehicle.make, value);
            setDropdownValues(prev => ({...prev, transmissions: []}));
        } else if (name === 'engine') {
            getDropdownValues('transmissions', selectedVehicle.year, selectedVehicle.make, selectedVehicle.model, value);
        }
    };

    const getDropdownValues = async (category, year = '', make = '', model = '', engine = '') => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        let url = `/api/get-${category}?`;
        const params = new URLSearchParams();

        if (year) params.append('year', year);
        if (make) params.append('make', make);
        if (model) params.append('model', model);
        if (engine && category === 'transmissions') params.append('engine', engine);

        url += params.toString();

        try {
            const response = await fetch(url, reqOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();

            if (category === 'years') {
                data = data.map(item => item._id);
            }

            setDropdownValues(prev => ({
                ...prev,
                [category]: data
            }));
        } catch (error) {
            console.error(`Failed to fetch ${category}:`, error);
        }
    };

    const handleSelectAndAddVehicle = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        const queryParameters = new URLSearchParams(selectedVehicle).toString();
        try {
            const response = await fetch(`/api/get-config-id?${queryParameters}`, reqOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.config_id) {
                setConfigId(data.config_id);
                console.log("CONFIG " + data.config_id)
                console.log("SELECTED VEHICLE " + selectedVehicle)
                await addVehicleToUser();
            } else {
                console.log("No config ID found for the selected vehicle.");
            }
        } catch (error) {
            console.error("Error selecting vehicle:", error);
        }
    };

    const addVehicleToUser = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");
        const reqOptions = {
            method: 'POST',
            header: myHeaders,
            body: { config_id: configId },
            redirect: 'follow'
        };
        try {
            const response = await fetch(`/api/add-vehicle?config_id=${configId}`, reqOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setVehicleAdded(true);
        } catch (error) {
            console.error("Error adding vehicle to user:", error);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <h2>
                    <span onClick={() => navigate('/garage')}
                          style={{cursor: 'pointer', color: '#644A77', fontWeight: 'bold'}}>
                        {user} Garage
                    </span>
                    <span style={{color: '#644A77', fontWeight: 'normal'}}> > Add New Vehicle</span>
                </h2>
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="yearSelect">
                            <Form.Label style={{fontWeight: 'bold', color: '#644A77'}}>Year</Form.Label>
                            <Form.Select name="year" value={selectedVehicle.year} onChange={handleChange}>
                                <option value="">Select Year</option>
                                {dropdownValues.years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {selectedVehicle.year && (
                            <Form.Group controlId="makeSelect">
                                <Form.Label style={{fontWeight: 'bold', color: '#644A77'}}>Make</Form.Label>
                                <Form.Select name="make" value={selectedVehicle.make} onChange={handleChange}>
                                    <option value="">Select Make</option>
                                    {dropdownValues.makes.map((make, index) => (
                                        <option key={index} value={make}>{make}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        {selectedVehicle.make && (
                            <Form.Group controlId="modelSelect">
                                <Form.Label style={{fontWeight: 'bold', color: '#644A77'}}>Model</Form.Label>
                                <Form.Select name="model" value={selectedVehicle.model} onChange={handleChange}>
                                    <option value="">Select Model</option>
                                    {dropdownValues.models.map((model, index) => (
                                        <option key={index} value={model}>{model}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        {selectedVehicle.model && (
                            <Form.Group controlId="engineSelect">
                                <Form.Label style={{fontWeight: 'bold', color: '#644A77'}}>Engine</Form.Label>
                                <Form.Select name="engine" value={selectedVehicle.engine} onChange={handleChange}>
                                    <option value="">Select Engine</option>
                                    {dropdownValues.engines.map((engine, index) => (
                                        <option key={index} value={engine}>{engine}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        {selectedVehicle.engine && (
                            <Form.Group controlId="transmissionSelect">
                                <Form.Label style={{fontWeight: 'bold', color: '#644A77'}}>Transmission</Form.Label>
                                <Form.Select name="transmission" value={selectedVehicle.transmission}
                                             onChange={handleChange}>
                                    <option value="">Select Transmission</option>
                                    {dropdownValues.transmissions.map((transmission, index) => (
                                        <option key={index} value={transmission}>{transmission}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        <div className="text-center mt-4">
                            <Button className="btn btn-primary" onClick={handleSelectAndAddVehicle}
                                    disabled={!selectedVehicle.transmission || vehicleAdded}>Select and Add
                                Vehicle</Button>
                        </div>
                        {vehicleAdded && <div className="alert alert-success mt-4" role="alert">
                            Vehicle has been added successfully!
                        </div>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AddVehicle;