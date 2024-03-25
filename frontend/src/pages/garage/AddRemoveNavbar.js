import {Link} from "react-router-dom";

function AddRemoveNavbar() {
    return (
        <div>
            <Link to="/garage/add">Add</Link>
            <Link to="/garage/remove">Remove</Link>
        </div>
    )
}

export default AddRemoveNavbar;