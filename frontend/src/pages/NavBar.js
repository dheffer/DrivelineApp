import {Nav, Navbar} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React from "react";

function NavBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/garage">Driveline</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/garage">Garage</Nav.Link>
                        <Nav.Link href="/settings">Settings</Nav.Link>
                    </Nav>

                </Navbar.Collapse>
                <Nav className={"ms-auto"}>
                    <Navbar.Text >Signed in as: placeholder</Navbar.Text>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
