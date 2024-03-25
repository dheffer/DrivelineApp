import {BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";
import AddRemoveNavbar from "./AddRemoveNavbar";
import VehicleInfo from "../vehicle/VehicleInfo";
import Accordion from 'react-bootstrap/Accordion';

function Garage() {
    // TODO: REPLACE WITH REAL VALUES, THESE ARE USED AS TEST VALUES
    const vehicles = ["2009 Nord Campy", "2015 Yotota Bav", "2019 Pesla Godel3", "2014 Nord Bustang",
     "2017 Yotota Camry", "2016 Pesla GodelS", "2018 Nord Bustang", "2010 Yotota Bav"]
  return (
      <div>
          <AddRemoveNavbar/>
          <Routes>
              <Route path="/garage/add"/>
              <Route path="/garage/remove"/>
              <Route path={"/garage/vehicle-info/:vehicle"} element={<VehicleInfo />} />
          </Routes>

          <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Vehicle List</Accordion.Header>
                    <Accordion.Body>
                        <table>
                            <tbody>
                            {vehicles.map((vehicle,id) => {
                                let param = vehicle.replaceAll(" ", "-").toLowerCase();
                                return (
                                    <tr key={id}>
                                        <td><Link to={"/garage/vehicle-info/"+param} >{vehicle}</Link></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </Accordion.Body>
                </Accordion.Item>
          </Accordion>

          {vehicles.map((vehicle,id) => {
              let param = vehicle.replaceAll(" ", "-").toLowerCase();
              return (
                  <Accordion.Item eventKey={id+""}>
                      <Accordion.Header>{vehicle}</Accordion.Header>
                      <Accordion.Body>
                          <Link to={"/garage/vehicle-info/"+param} >Info</Link>
                          <Link to={"/garage/vehicle-history/"+param} >History</Link>
                      </Accordion.Body>
                  </Accordion.Item>
              )
          })}
          <table>
          <tbody>
          {vehicles.map((vehicle,id) => {
              let param = vehicle.replaceAll(" ", "-").toLowerCase();
              return (
                  <tr key={id}>
                      <td><Link to={"/garage/vehicle-info/"+param} >{vehicle}</Link></td>
                  </tr>
              )
          })}
          </tbody>
          </table>
      </div>
  );
}

export default Garage;