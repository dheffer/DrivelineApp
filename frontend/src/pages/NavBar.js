import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from 'react';
import Settings from "./Settings";
import '../App.css';

function NavBar() {
    const [user, setUser] = useState("Placeholder User");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("USERNAME DATA: " + data.name);
                        setUser(data.name);

                    }
                    else {
                        console.error("User not found");
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar-bottom-margin" sticky="top">
            <Container>
                <Navbar.Brand href="/garage" style={{ display: 'flex', alignItems: 'flex-start', marginDown: '35px' }}>
                    <span className="drive" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '15px' }}>Drive</span><span className="line" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '15px' }}>line</span>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/garage">Garage</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Nav className={"ms-auto"}>
                    <Navbar.Text><Settings greeting={`Signed in as: ${user || 'LOADING...'}`} /></Navbar.Text>
                    <Settings />
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
