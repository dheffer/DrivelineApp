import {Nav, Navbar} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React from "react";
import Settings from "./Settings";
import Button from "react-bootstrap/Button";

function NavBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" sticky={"top"}>
            <Container>
                <Navbar.Brand href="/garage">Driveline</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/garage"><Button variant="primary">Garage</Button></Nav.Link>

                    </Nav>

                </Navbar.Collapse>
                <Nav className={"ms-auto"}>
                    <Settings />
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
