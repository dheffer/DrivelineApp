import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#5C75A4', color: 'white', textAlign: 'center', padding: '10px 0' }}>
            <Container>
                © 2024 drivelineapp.xyz | <a href="https://github.com/dheffer/PredictiveVehicleMaintenanceSystem/blob/main/privacy-policy.md" style={{ color: 'white' }}>Privacy Policy</a>
            </Container>
        </footer>
    );
};


export default Footer;
