import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { getGoogleOauthURL } from './OauthClient.js';
import { oauthClient } from './OauthClient.js';
import 'dotenv/config';
import client from "./mongo.js";
import mongo from "./mongo.js"
import {parse} from "dotenv";


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DATABASE = client.db("vehicleDB");
const EMAIL = process.env.EMAIL;


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
            jwt.sign( {"name":user.name, "email":user.email}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
                if(err) {
                    res.status(500).json(err);
                }
                res.redirect(`http://localhost:3000/login?token=${token}`);
            });
        })
        .catch((error) => 
         {
            console.error(error);
            res.status(500).json(error);
        });
    });

app.get('/api/auth/google/url', async (req, res) => {
    console.log("hit /api/auth/google/url")
    res.status(200).json({url: googleOAuthURL});
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/user', async (req, res) => {
    const { authorization } = req.headers;
    console.log("USER AUTHORIZ: "+authorization)
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        console.log(token+ ": TOKEN");
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }

            console.log("Decoded:   "+decoded);

            const DATABASE = client.db("vehicleDB");
            const users = DATABASE.collection("users");

            const user = await users.findOne({email: decoded.email});
            console.log("AUTHORIZ USER: "+user);

            if(!user) {
                res.status(404).json({message: "User not found"});
            }
            res.json(user);
        });
    }
    catch(err) {
        res.status(500).json(err);
    }

});

const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    const {
        name,
        email,
    } = oauthUserInfo;

    console.log(name);
    console.log(email);
    
    const users = DATABASE.collection("users");

    const existingUser = await users.findOne({email})

    if( existingUser ) {
        const result = await users.findOneAndUpdate({email},
            { $set: {name, email}},
            { returnDocument: "after"}
        );
        return result;
    }
    else {
        const result = await users.insertOne( {email, name});
        return { email, name, _id: result.insertedId };
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***
    * This route is used to get the vehicle information from the DATABASE
 * @param configId - The config_id of the vehicle
 */
app.get('/api/get-vehicle-info', async (req, res) => {
   const vehicle = DATABASE.collection("configurations");
   const configId = req.query.configId;
   const getConfiguration = await vehicle.findOne({config_id: parseInt(configId)});

   res.json(getConfiguration);
});

/***
    * This route is used to get the vehicle history from the DATABASE
 * @param configId - The config_id of the vehicle
 * @param email - The email of the user
 */

app.get('/api/get-vehicle-history', async (req, res) => {
    const history = DATABASE.collection("user_vehicle_info");
    const configId = req.query.configId;

    const getHistory = await history.aggregate([
        {
            $match: {
                config_id: parseInt(configId),
                email: EMAIL
            }
        },
        {
            $project: {
                _id: 0,
                completed_maintenance: 1
            }
        }
    ]).toArray();
    res.send(getHistory);
});

app.post('/api/update-maintenance-history', async (req, res) => {
    try {
        const garage = DATABASE.collection("user_vehicle_info");

        const {
            old_type, old_date, old_maintenance, old_cost,
            new_type, new_date, new_maintenance, new_cost
        } = req.body;
        const update = await garage.updateOne(
            {
                email: EMAIL,
                "completed_maintenance.type": old_type,
                "completed_maintenance.date": old_date,
                "completed_maintenance.maintenance": old_maintenance,
                "completed_maintenance.cost": parseInt(old_cost)
            },
            {
                $set: {
                    "completed_maintenance.$.type": new_type,
                    "completed_maintenance.$.date": new_date,
                    "completed_maintenance.$.maintenance": new_maintenance,
                    "completed_maintenance.$.cost": parseInt(new_cost)
                }
            }
        );
        return res.json(update.modifiedCount);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

});

app.delete('/api/delete-maintenance-history', async (req, res) => {
    const garage = DATABASE.collection("user_vehicle_info");

    const { type, date, maintenance, cost } = req.body;
    const deletion = await garage.updateOne(
        {
            email: EMAIL
        },
        {$pull:
                {
                    completed_maintenance: {
                        type: type,
                        date: date,
                        maintenance: maintenance,
                        cost: cost
                    }
                }
        }
    );
    return res.json(deletion.modifiedCount);
});

/***
 * This route is used to get the user's vehicles from the DATABASE
 */
app.get('/api/get-user-vehicles', async (req, res) => {
    const garage = DATABASE.collection("user_garage");

    const vehicles = await garage.aggregate([
        {
            $match: {
                email: EMAIL
            }
        },
        {
            $lookup: {
                from: 'configurations',
                localField: 'vehicle_config_ids',
                foreignField: 'config_id',
                as: 'configurations'
            }
        },
        {
            $unwind: '$configurations'
        },
        {
            $project: {
                _id: 0,
                configurations: 1
            }
        }
    ]).toArray();
    res.send(vehicles);
});
app.delete('/api/delete-user-vehicle', async (req, res) => {
    const garage = DATABASE.collection("user_garage");

    const { config_id } = req.body;
    const deletion = await garage.updateOne(
        {email: EMAIL},
        {$pull: { vehicle_config_ids: config_id } }
    );
    return res.json(deletion.modifiedCount);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//const config_id = 401988727;
// app.get('/api/get-maintenance', async (req , res) => {
//     const DATABASE = client.db("vehicleDB");
//     const message = DATABASE.collection("maintenance");
//
//     const docObject =   await message.findOne({config_id: 401988727});
//     await console.log(docObject);
//     res.send(docObject.message);
// })

app.get('/api/get-maintenance', async (req , res) => {
    const message = DATABASE.collection("maintenance");

    // const docObject = await message.findOne({ config_id: { $eq: 401988727} });

    const docObject = await message.findOne({});
    await console.log(docObject.schedules[0].tasks);
    res.send(docObject.message);
})

const selected_year = 2024;
const selected_make = "Toyota";
const selected_model = "Camry";
const selected_engine = "2.5L 4cyl";
const selected_transmission = "8A";
// 401999975

//TODO: Request to get a config_id given a vehicle's Year, Make, Model, Engine, and Transmission.
app.get('/api/get-config-id', async (req, res) => {
    const message = DATABASE.collection("configurations");

    //Use for loop to iterate through all the objects in the collection and get the config_id for the object that matches the selected year, make, model, engine, and transmission.
    const docObject = await message.find({year: selected_year, make: selected_make, model: selected_model, engine: selected_engine, transmission: selected_transmission});
    for await (const doc of docObject) {
        console.log(doc.config_id);
    }

    //await console.log(docObject);

    res.send(docObject.message);
})

//TODO: Request to get a list of all years (Non-repeating).

//TODO: Request to get a list of all makes given a year (Non-repeating).
app.get('/api/get-makes', async (req, res) => {
    console.log("hit get makes route");

    const carYear = req.query.year;
    console.log("year INSIDE MAKES: "+carYear);

    if(!carYear) {
        return res.status(400).json({message: "Missing required fields"});
    }

    const database = client.db("vehicleDB");
    const configurations = database.collection("configurations");

    const makesYear = await configurations.find({year: parseInt(carYear)});
    console.log("makesYear " + makesYear)

    const makesGroup = await configurations.aggregate([
        { $match: { year: parseInt(carYear) }},
        { $group: { _id: "$make", makes: { $addToSet: "$make" } }}
    ]).toArray();
     /*
    const makesGroup = await configurations.aggregate([
        { $match: { year: parseInt(carYear) }},
        { $project: { _id: 0, make: 1 }}
    ]).toArray();

     */
    console.log("makesGroup " + makesGroup)

    const makesSort = await configurations.aggregate([
        { $match: { year: parseInt(carYear) }},
        { $group: { _id: "$make", makes: { $addToSet: "$make" } }},
        { $sort: { _id: 1 }}
    ]).toArray();

    console.log("makesSort " + makesSort)

    //     const makes = await configurations.aggregate([
    //     { $match: { year: year }},
    //     { $group: { _id: "$make", makes: { $addToSet: "$make" } }},
    //     { $sort: { _id: 1 }}
    // ]).toArray();
    // console.log("makes " + makes)

    // const uniqueMakes = makes.map(make => make._id);

    // console.log("makes " +uniqueMakes)
    res.send(makesSort);
})

//TODO: Request to get a list of all models given a year and make (Non-repeating).

//TODO: Request to get a list of all engines given a year, make, and model (Non-repeating).

//TODO: Request to get a list of all transmissions given a year, make, model, and engine (Non-repeating).

//TODO: Request to get a list of all maintenance intervals given a vehicle's config_id.

//TODO: Request to get a list of all maintenance tasks given a vehicle's config_id and mileage.

//TODO: Request to get maintenance data given a vehicle's config_id and mileage.


app.listen(port, () => {
    console.log(`Predictive Vehicle Maintenance app listening on port ${port}`)
    //console.log(mongo);
});