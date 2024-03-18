import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { getGoogleOauthURL } from './getGoogleOauthURL.js';

//import jwt from 'jsonwebtoken'; // TODO - add a jsonwebtoken package or module

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log('CHECK HERE __dirname:', __dirname);
console.log('CHECK HERE Resolved path to index.html:', path.join(__dirname, '../build/index.html'));

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


const port = process.env.PORT || 8080;
//const JWTSecret = "test123";

// app.get('/api/login', (req, res) => {
//     jwt.sign( {"name":"Brandon", "email":"johnson9713@gmail.com", "accountId":12}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
//         if(err) {
//             res.status(500).json(err);
//         }
//         res.status(200).json({token});
//     });
// });
app.get('/', (req, res) => {
    res.send('Welcome to the Predictive Vehicle Maintenance app!');
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/auth/google/url', async (req, res) => {
    const url = getGoogleOauthURL();
    console.log("URL: ", url);
    res.status(200).json({url});
});

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