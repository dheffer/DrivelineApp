import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from 'react';
import Settings from "./Settings";
import '../App.css';
import Button from "react-bootstrap/Button";
import { GearFill } from 'react-bootstrap-icons';
import '../App.css';

function NavBar() {
    const [user, setUser] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const token = localStorage.getItem('token');
                if(token) {
                    const response = await fetch('/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if(response.ok){
                        const data = await response.json();
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
        <Navbar expand="lg" style={{ backgroundColor: '#a8c1f0' }} sticky="top">
            <Container>
                <Navbar.Brand href="/garage" className="d-flex justify-content-start" style={{ color: 'white' }}>
                    <span className="drive" style={{ display: 'flex', alignItems: 'flex-start'}}>Drive</span>
                    <span className="line" style={{ display: 'flex', alignItems: 'flex-start'}}>line</span>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/garage" style={{ color: 'white', marginTop: "7px" }}>Garage</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    <Nav.Link style={{ color: 'white' }}>
                        <Settings greeting={user ? user : ' '} />
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
