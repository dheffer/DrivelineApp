import { useEffect, useState } from "react";

function AddVehicle() {
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

    const [currentDropdown, setCurrentDropdown] = useState('years');

    useEffect(() => {
        getDropdownValues('years');
    }, []);

    const getDropdownValues = async (value) => {

        const myHeaders = new Headers();
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(`/api/get-${value}`, reqOptions) // make the gets for specific values
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            const years = data.map(item => item[value]);
            const allYears = data.reduce((acc, curr) => [...acc, ...curr.years], []);
            setDropdownValues(prevDropdownValues => ({
                ...prevDropdownValues,
                [value]: allYears
            }));
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    const selectVehicle = async () => {
        try{
            const response = await fetch(`/api/get-config-id?year=${selectedVehicle.year}&make=${selectedVehicle.make}&model=${selectedVehicle.model}&engine=${selectedVehicle.engine}&transmission=${selectedVehicle.transmission}`);
            if(!response.ok) {
                console.log("Error selecting vehicle");
                return;
            }
            const data = await response.json();
            console.log("CONFIG ID: " + data.config_id);

            setConfigId(data.config_id);
        }
        catch(error) {
            console.log(error);
        }
    }

    const addVehicleToUser = async () => {
        console.log("CONFIG ID in ADD vehicle: " + configId);
        try{
            const response = await fetch('/api/add-vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: "johnson@gmail,com",
                    config_id: configId
                })
            });
            if(!response.ok) {
                console.log("Error adding vehicle to user");
                return;
            }
            setVehicleAdded(true);
    }
    catch(error) {
        console.log(error);
    }
}


    const handleChange = async (e) => {
        const { name, value } = e.target;
        setSelectedVehicle(prevSelectedVehicle => ({
            ...prevSelectedVehicle,
            [name]: value
        }));
        console.log("NAME: " + name)
        console.log("VALUE: " + value)
        console.log("Selected YEAR: " + selectedVehicle.year)
        switch(name) {
            case 'year':
                setCurrentDropdown('makes');
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    makes: [],
                    models: [],
                    engines: [],
                    transmissions: []
                }));
                const makesResponse = await fetch(`/api/get-makes?year=${value}`);
                if(!makesResponse.ok) {
                    console.log("Error getting makes");
                    return;
                }
                const makesData = await makesResponse.json();
                console.log("MAKES CHANGE: " + makesData)
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    makes: makesData
                }));
                setSelectedVehicle(prevSelectedVehicle => ({
                    ...prevSelectedVehicle,
                    [name]: value
                }));
                break;
            case 'make':
                setCurrentDropdown('models');
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    models: [],
                    engines: [],
                    transmissions: []
                }));
                const modelsResponse = await fetch(`/api/get-models?year=${selectedVehicle.year}&make=${value}`);
                if(!modelsResponse.ok) {
                    console.log("Error getting models");
                    return;
                }
                const modelsData = await modelsResponse.json();
                // const makes = makesData.map(item => item.make);
                console.log("MODELS CHANGE: " + modelsData)
                setSelectedVehicle(prevSelectedVehicle => ({
                    ...prevSelectedVehicle,
                    [name]: value
                }));
                console.log("Selected make: " + name + " " + value)
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    models: modelsData
                }));
                setSelectedVehicle(prevSelectedVehicle => ({
                    ...prevSelectedVehicle,
                    [name]: value
                }));
                break;
            case 'model':
                setCurrentDropdown('engines');
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    engines: [],
                    transmissions: []
                }));
                const enginesResponse = await fetch(`/api/get-engines?year=${selectedVehicle.year}&make=${selectedVehicle.make}&model=${value}`);
                if(!enginesResponse.ok) {
                    console.log("Error getting Engines");
                    return;
                }
                const enginesData = await enginesResponse.json();
                console.log("ENGINES CHANGE: " + enginesData)
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    engines: enginesData
                }))
                setSelectedVehicle(prevSelectedVehicle => ({
                    ...prevSelectedVehicle,
                    [name]: value
                }));
                break;
            case 'engine':
                setCurrentDropdown('transmissions');
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    transmissions: []
                }));
                const transmissionsResponse = await fetch(`/api/get-transmissions?year=${selectedVehicle.year}&make=${selectedVehicle.make}&model=${selectedVehicle.model}&engine=${value}`);
                if(!transmissionsResponse.ok) {
                    console.log("Error getting Transmissions");
                    return;
                }
                const transmissionsData = await transmissionsResponse.json();
                console.log("TRANSMISSIONS CHANGE: " + transmissionsData)
                setDropdownValues(prevDropdownValues => ({
                    ...prevDropdownValues,
                    transmissions: transmissionsData
                }))
                setSelectedVehicle(prevSelectedVehicle => ({
                    ...prevSelectedVehicle,
                    [name]: value
                }));
                break;
            default:
                break;
        }
    }

    return (
        <div>
            {currentDropdown === 'years' && (
                <select name="year" value={selectedVehicle.year} onChange={handleChange}>
                <option value="">Select Year</option>
                {dropdownValues.years.map((year, index) => {
                    return <option key={index} value={year}>{year}</option>
                })}
            </select>
            )}
            {currentDropdown === 'makes' && (
                <select name="make" value={selectedVehicle.make} onChange={handleChange}>
                <option value="">Select Make</option>
                {dropdownValues.makes.map((make, index) => {
                    return <option key={index} value={make}>{make}</option>
                })}
            </select>
            )}
            {currentDropdown === 'models' && (
                <select name="model" value={selectedVehicle.model} onChange={handleChange}>
                <option value="">Select Model</option>
                {dropdownValues.models.map((model, index) => {
                    return <option key={index} value={model}>{model}</option>
                })}
            </select>
            )}
            {currentDropdown === 'engines' && (
                <select name="engine" value={selectedVehicle.engine} onChange={handleChange}>
                <option value="">Select Engine</option>
                {dropdownValues.engines.map((engine, index) => {
                    return <option key={index} value={engine}>{engine}</option>
                })}
            </select>
            )}
            {currentDropdown === 'transmissions' && (
                <select name="transmission" value={selectedVehicle.transmission} onChange={handleChange}>
                <option value="">Select Transmission</option>
                {dropdownValues.transmissions.map((transmission, index) => {
                    return <option key={index} value={transmission}>{transmission}</option>
                })}
            </select>
            )}
            <button onClick={selectVehicle}>Select Vehicle</button>
            {configId && <button onClick={addVehicleToUser}>Add Vehicle</button>}
            {vehicleAdded && <p>Vehicle has been added successfully!</p>}
        </div>
    )
}


export default AddVehicle;