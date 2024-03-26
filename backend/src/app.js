import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { getGoogleOauthURL } from './OauthClient.js';
import { oauthClient } from './OauthClient.js';
import 'dotenv/config';
import mongo from "./mongo.js"
import client from "./mongo.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log("\n\nPROCESS APP PAGE"+CLIENT_ID)
console.log("PROCESS APP PAGE"+CLIENT_SECRET)

const app = express();

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
    console.log("Hit callback route");

    const { code } = req.query;

    console.log(code);

    const { tokens } = await oauthClient.getToken(code);

    console.log(tokens);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const myHeaders = new Headers();
    const bearerToken = "Bearer "+tokens.id_token;
    myHeaders.append("Authorization", bearerToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => updateOrCreateUserFromOauth(result))
        .then((user) => {
            console.log(user)
            jwt.sign( {"name":user.name, "email":user.email, "accountId":user.id}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
                if(err) {
                    res.status(500).json(err);
                }
                res.redirect(`http://localhost:3000/login?token=${token}`);
            });
        })
        .catch((error) => 
         {
            console.error(error);
            res.status(500).json(err);
         });
})

app.get('/api/auth/google/url', async (req, res) => {
    console.log("hit /api/auth/google/url")
    console.log("CLIENT ID " + CLIENT_ID);
    console.log("CLIENT SECRET " + CLIENT_SECRET);
    res.status(200).json({url: googleOAuthURL});
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    const {
        email,
        name
    } = oauthUserInfo;

    console.log("OAUTH USER INFO: " + email + " " + name);

    // const database = client.db("PredictiveVehicleMaintenance");
    // const collection = database.collection("users");

    // const existingUser = await users.findOne({email})

    //if(existingUser) {
        // const result = await users.findOneAndUpdate({email})
            //{ $set: {name, email}},
            //{ returnDocument: "after"}
        //);
        //return result;
    //} else {
        // const result = await users.insertOne({name, email});
        //return { email, name, _id: result.insertedId };

    }

// TODO: Configure this route using the getVehicleConfig function below
app.get('/api/get-configuration', async (req, res) => {
    const database = client.db("vehicleDB");
    const message = database.collection("configurations");

    const docObject = await message.findOne({config_id: 402001368});
    await console.log(docObject);
    res.send(docObject.message);
});

const getVehicleConfig = async (config_id) => {
    const database = client.db("vehicleDB");
    const message = database.collection("configurations");

    const docObject = await message.findOne({config_id: config_id});
    await console.log(docObject);
    return docObject;
}

/***
 * This route is used to get the user's vehicles from the database
 */
app.get('/api/get-user-vehicles', async (req, res) => {
    const database = client.db("vehicleDB");
    const garage = database.collection("user_garage");

    const docObject = await garage.findOne({user_id: "dheffer"});
    const vehicles = [];
    let vehicle = {};

    for await (const vehicle_id of docObject.vehicle_config_ids) {
        vehicles.push(await getVehicleConfig(vehicle_id));
    }

    //await console.log(vehicles);
    res.send(vehicles);
});

app.listen(port, () => {
    console.log(`Predictive Vehicle Maintenance app listening on port ${port}`)
    //console.log(mongo)
});