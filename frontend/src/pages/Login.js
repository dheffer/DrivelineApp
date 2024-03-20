import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
    const [googleOauthURL, setGoogleOauthURL] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    let navigate = useNavigate();

    useEffect( () => {
        const token = searchParams.get('token');
        if(token) {
            localStorage.setItem('token', token);
            navigate('/');
        }
    }, [])

    useEffect( () => {
            fetch("/api/auth/google/url")
            .then( response => response.json())
            .then( data => setGoogleOauthURL(data.url))
            .catch( e => {
                console.log('error');
                console.log(e.message);
                localStorage.clear()
            })
    }, []);

    return <button disabled={!googleOauthURL} onClick={() => window.location.href = googleOauthURL}>Click to Login to Google</button>
}

    export default Login;