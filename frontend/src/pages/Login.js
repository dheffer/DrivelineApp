import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import React from 'react';
import '../App.css';

export const Login = () => {
    const [googleOauthURL, setGoogleOauthURL] = useState('');
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');

    let navigate = useNavigate();

    useEffect(() => {
        fetchGoogleOauthURL();
    }, []);

    const fetchGoogleOauthURL = async () => {
        fetch("/api/auth/google/url")
            .then(response => response.json())
            .then(data => setGoogleOauthURL(data.url))
            .catch(e => {
                console.log('error', e.message);
                setError('An error occurred while fetching the Google OAuth URL.');
                localStorage.clear();
            });
    };

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/garage');
        }
    }, [searchParams, navigate]);

    const handleLogin = () => {
        if (googleOauthURL) {
            window.location.href = googleOauthURL;
        } else {
            setError('Google OAuth URL not found');
        }
    };

    return (
        <div className="page-container">
            <Container className="text-center">
                <img src="/logo.png" alt="Logo" id="driveline-diamond-logo" />
                <h1>Welcome to <span className="drive">Drive</span><span className="line">line</span></h1>
                <p id="intro-text">Your personalized tool to help keep your vehicle in top condition.</p>
                <Button variant="primary" id="get-started-button" onClick={handleLogin} className="mt-4">Sign in with Google</Button>
                {error && <div className="mt-3"><Alert variant="danger">{error}</Alert></div>}
            </Container>
        </div>
    );
};

export default Login;