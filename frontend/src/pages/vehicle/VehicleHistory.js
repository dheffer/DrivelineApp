import {BrowserRouter, Routes, Route, useParams, useLocation} from "react-router-dom";
import VehicleNavbar from "./VehicleNavbar";
import UploadNavbar from "../maintenance-history/UploadNavbar";
import {useEffect, useState} from "react";

function VehicleHistory(props) {
    const location = useLocation();
    const { configId } = location.state;

    const [loading, setLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    const [maintenance, setMaintenance] = useState(null);

    useEffect(() => {
        const myHeaders = new Headers();
        const reqOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch('/api/get-vehicle-history?configId='+configId, reqOptions)
            .then( (res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then( (maintenance) => {
                setMaintenance(maintenance[0]);
                setLoading(false);
            })
            .catch( (error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, []);

    return (
        <div className="container">
            <VehicleNavbar/>
            <Routes>
                <Route path="/garage/vehicle-info/:vehicle/*"/>
                <Route path="/garage/vehicle-history/:vehicle/*"/>
            </Routes>

            <UploadNavbar/>
            <Routes>
                <Route path="/garage/vehicle-history/upload"/>
                <Route path="/garage/vehicle-history/manual"/>
            </Routes>
            <div className="row">
                <div className="col-md-1 order-md-1"/>
                <div className="col-md-10 order-md-2">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
                            <h1>Vehicle History</h1>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Type</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Service</th>
                                    <th scope="col">Cost</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    maintenance != null ?
                                        maintenance.completed_maintenance.map((service, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{service.type}</td>
                                                    <td>{service.date}</td>
                                                    <td>{service.maintenance}</td>
                                                    <td>{service.cost}</td>
                                                </tr>
                                            )
                                        }) : <tr><td colSpan="4">No maintenance history!</td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                </div>
                <div className="col-md-1 order-md-3"/>
            </div>
        </div>
    );
}

export default VehicleHistory