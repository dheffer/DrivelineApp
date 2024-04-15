import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="footer mt-auto py-3 bg-light">
            <Container className="text-center">
                <span className="text-muted">© 2024 drivelineapp.xyz | </span>
                <a href="https://github.com/dheffer/PredictiveVehicleMaintenanceSystem/blob/main/privacy-policy.md" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </Container>
        </footer>
    );
}

export default Footer;
