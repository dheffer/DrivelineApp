import { useEffect, useState } from 'react';


export const Login = () => {
    const [googleOauthURL, setGoogleOauthURL] = useState('');

    useEffect(() => {
            fetch("/api/auth/google/url")
            .then((response) => response.json())
            .then( data => setGoogleOauthURL(data.url))
            .catch( e => {
                console.log('error');
                console.log(e.message);
                localStorage.clear()
            })
    }, []);

    return (
        <div>
        <h1>Login</h1>
            <button disabled={!googleOauthURL}
                onClick={() => window.location.href = googleOauthURL}
            >Click to Login to Google</button>
        </div>
    );
    }

    export default Login;