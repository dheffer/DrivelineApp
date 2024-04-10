import {Nav, Navbar} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React from "react";
import {useState, useEffect} from 'react';
import Settings from "./Settings";
import Button from "react-bootstrap/Button";
import { GearFill } from 'react-bootstrap-icons';
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
                        console.log("USERNAME DATA: ", data.name);
                        setUser(data.name);
                    } else {
                        console.error("User not found");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar-bottom-margin" sticky="top">
            <Container>
                <Navbar.Brand href="/garage"><span className="drive">Drive</span><span
                    className="line">line</span></Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                <Nav className="me-auto">
                        <Nav.Link href="/garage">Garage</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Nav className="ms-auto">
                    <Nav.Link>
                        <Settings greeting={`${user || 'LOADING...'}`} />
                        <GearFill className="ml-2" />
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;