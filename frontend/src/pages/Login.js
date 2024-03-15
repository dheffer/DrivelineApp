import { useState } from 'react';


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <form>
            <input value={email} onChange={e => setEmail(e.target.value)}
            type="text" placeholder="info@gmail.ca" />

            <input value={password} onChange={e => setPassword(e.target.value)} 
            type="password" placeholder="Password" />
            <button onClick={onLoginClick}>Login</button>
        </form>
        </div>
    );
    }

    export default Login;