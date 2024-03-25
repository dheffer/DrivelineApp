import {BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";
import GarageNavbar from "./GarageNavbar";
import AddRemoveNavbar from "./AddRemoveNavbar";
import VehicleInfo from "./VehicleInfo";
import Settings from "./Settings";

function Garage() {
    // TODO: REPLACE WITH REAL VALUES, THESE ARE USED AS TEST VALUES
    const cars = ["2009 Nord Campy", "2015 Yotota Bav", "2019 Pesla Godel3", "2014 Nord Bustang",
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
          {cars.map((car,id) => {
              let param = car.replaceAll(" ", "-").toLowerCase();
              return (
                  <tr key={id}>
                      <td><Link to={"/garage/vehicle-info/"+param} >{car}</Link></td>
                  </tr>
              )
          })}
          </tbody>
          </table>
      </div>
  );
}

export default Garage;