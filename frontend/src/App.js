import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
  return (
    <BrowserRouter>
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;