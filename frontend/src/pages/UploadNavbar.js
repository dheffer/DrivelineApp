import {Link} from "react-router-dom";

function UploadNavbar() {
    return (
        <div>
            <Link to="/garage/vehicle-history/upload">Upload</Link>
            <Link to="/garage/vehicle-history/manual">Manual</Link>
        </div>
    );
}

export default UploadNavbar;