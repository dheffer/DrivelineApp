import {Nav, Navbar} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React from "react";
import {useState, useEffect} from 'react';

function NavBar() {
    const [user, setUser] = useState("Placeholder User");

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
                        console.log("USERNAME DATA: "+data.name);
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
        }
        fetchUser();
    }, []);
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
                    <Navbar.Text >Signed in as: {user || 'LOADING...'}</Navbar.Text>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;
