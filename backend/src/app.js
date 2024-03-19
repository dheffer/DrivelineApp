
import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { getGoogleOauthURL } from './OauthClient.js';
import { oauthClient } from './OauthClient.js';
import 'dotenv/config'

console.log("PROCESS APP PAGE"+process.env.GOOGLE_CLIENT_ID)

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;



//import jwt from 'jsonwebtoken'; // TODO - add a jsonwebtoken package or module

const app = express()

const googleOAuthURL = getGoogleOauthURL();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


const port = process.env.PORT || 8080;
const JWTSecret = "test123";

const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}

app.get( '/api/auth/google/callback', async (req, res) => {
    console.log("hit Callback Route")

    const { code } = req.query;

    console.log("code: ", code);

    const { tokens } = await oauthClient.getToken(code);
    console.log("token: ", tokens);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const myHeaders = new Headers();
    const bearerToken = "Bearer "+tokens.id_token;
    myHeaders.append("Authorization", bearerToken);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            console.log("CLIENT ID " + CLIENT_ID);
            console.log("CLIENT SECRET " + CLIENT_SECRET);
            jwt.sign( {"name":result.name, "email":result.email, "accountId":result.id}, JWTSecret, {expiresIn: '2d'}, (err, token) => 
            {
                if(err) {
                    res.status(500).json(err);
                }
                res.redirect(`http://localhost:3000/login?token=${token}`);
            })
            .catch((error) => {
                console.log('error', error);
                res.status(500).json(error);
            });
        })
});

app.get('/api/auth/google/url', async (req, res) => {
    res.status(200).json({url: googleOAuthURL});
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

//TEST get
app.get('/api/users', async (req, res) => {
    const users = [
        { id: 1, name: "Brandon"},
        { id: 2, name: "Delaney"},
        { id: 3, name: "Noah"}
    ]
        res.status(200).json(users);
});


app.listen(port, () => {
    console.log(`Predictive Vehicle Maintenance app listening on port ${port}`)
})