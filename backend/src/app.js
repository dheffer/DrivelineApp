import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
// import jwt from 'jsonwebtoken'; // TODO - add a jsonwebtoken package or module
import * as jwt from 'jsonwebtoken'
import mongo from "./mongo.js";
//import 'dotenv/config'

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const JWTSecret = "test123";

app.get('/api/login', (req, res) => {
    jwt.sign( {"name":"Brandon", "email":"johnson9713@gmail.com", "accountId":12}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
        if(err) {
            res.status(500).json(err);
        }
        res.status(200).json({token});
    });
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.listen(port, () => {
    console.log(`Predictive Vehicle Maintenance app listening on port ${port}`)
    console.log(mongo)
})