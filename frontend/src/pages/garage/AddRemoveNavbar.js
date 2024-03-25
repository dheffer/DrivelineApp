import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

function AddRemoveNavbar() {
    return (
        <div>
            <Link to="/garage/add"><Button>Add</Button></Link>
            <Link to="/garage/remove"><Button>Remove</Button></Link>
        </div>
    )
}

export default AddRemoveNavbar;