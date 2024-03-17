import { useEffect, useState } from 'react';


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [googleOauthURL, setGoogleOauthURL] = useState('');

    useEffect(() => {
        const loadOauthURL = async () => {
            try{
                const response = await fetch('/auth/google/url');
                const { url } = await response.data;
                setGoogleOauthURL(url);
            } catch (error) {
                console.error(error);
            }
            
        };
        loadOauthURL();
    }, []);

    const onLoginClick = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    }

    fetch("/api/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        localStorage.setItem("token", result.token);
    })
    .catch((error) => console.error(error));
};

    return (
        <div>
        <h1>Login</h1>
            <input value={email} onChange={e => setEmail(e.target.value)}
            type="text" placeholder="info@gmail.ca" />

            <input value={password} onChange={e => setPassword(e.target.value)} 
            type="password" placeholder="Password" />
            <button onClick={onLoginClick}>Login</button>
            <button
                onClick={() => window.location.href = googleOauthURL}
            >Click to login with Google</button>
        </div>
    );
    }

    export default Login;