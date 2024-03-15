import {Link} from "react-router-dom";
// /garage/vehicle-info/upload
function UploadNavbar() {
    return (
        <div>
            <Link to="/garage/vehicle-info/upload">Upload</Link>
            <Link to="/garage/vehicle-history/manual">Manual</Link>
        </div>
    );
}

export default UploadNavbar;