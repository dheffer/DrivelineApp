import {BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";
import VehicleNavbar from "../vehicle/VehicleNavbar";
import AddRemoveNavbar from "./AddRemoveNavbar";
import VehicleInfo from "../vehicle/VehicleInfo";

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