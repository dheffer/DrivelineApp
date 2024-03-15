import {Link} from "react-router-dom";

function NavBar() {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/garage">Garage</Link>
            <Link to="/settings">Settings</Link>
        </div>
    );
}

export default NavBar;