import {Link} from "react-router-dom";
import Settings from "./Settings";

function NavBar() {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/garage">Garage</Link>
            <Settings />
        </div>
    );
}

export default NavBar;