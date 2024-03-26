import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
    const [googleOauthURL, setGoogleOauthURL] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState('');

    let navigate = useNavigate();

    useEffect( () => {
        fetchGoogleOauthURL();
    }, []);

    const fetchGoogleOauthURL = async () => {
        fetch("/api/auth/google/url")
        .then( response => response.json())
        .then( data => setGoogleOauthURL(data.url))
        .catch( e => {
            console.log('error');
            console.log(e.message);
            localStorage.clear()
        })
};


    useEffect( () => {
        const token = searchParams.get('token');
        if(token) {
            localStorage.setItem('token', token);
            navigate('/garage');
        }
    }, [searchParams, navigate])

    const handleLogin = () => {
        if(googleOauthURL) {
            window.location.href = googleOauthURL;
        }
        else {
            setError('Google OAuth URL not found');
        }
    }

    return (
        <div>
            {error && <p>{error}</p>}
            <h1>Welcome to Vehicle Maintenance Prediction</h1>
            <button disabled={!googleOauthURL} onClick={handleLogin}>Login with Google</button>
        </div>
    )

}

    export default Login;