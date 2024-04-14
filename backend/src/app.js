import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { getGoogleOauthURL } from './OauthClient.js';
import { oauthClient } from './OauthClient.js';
import 'dotenv/config';
import client from "./mongo.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DATABASE = client.db("vehicleDB");

const app = express();

const googleOAuthURL = getGoogleOauthURL();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


const port = process.env.PORT || 8080;
const JWTSecret = process.env.JWTSecret;

const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}

app.get( '/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauthClient.getToken(code);
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
    res.status(200).json({url: googleOAuthURL});
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/user', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];

        jwt.verify(token, process.env.JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            console.log("API/USER")
            console.log(token);
            console.log("Decoded:   "+decoded.name+"\t"+decoded.email+ "\n");

            const DATABASE = client.db("vehicleDB");
            const users = DATABASE.collection("users");

            const user = await users.findOne({email: decoded.email});

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
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }

            const vehicle = DATABASE.collection("configurations");
            const configId = req.query.configId;
            const getConfiguration = await vehicle.findOne({config_id: parseInt(configId)});

            res.json(getConfiguration);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

/***
 * This route is used to get the vehicle history from the DATABASE
 * @param configId - The config_id of the vehicle
 * @param email - The email of the user
 */

app.get('/api/get-vehicle-history', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const history = DATABASE.collection("user_vehicle_info");
            const configId = req.query.configId;


            const getHistory = await history.aggregate([
                {
                    $match: {
                        config_id: parseInt(configId),
                        email: decoded.email
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
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

/***
 * This route is used to add maintenance history to the DATABASE
 * @param configId - The config_id of the vehicle
 * @param type - The type of maintenance
 * @param date - The date of the maintenance
 * @param maintenance - The maintenance performed
 * @param cost - The cost of the maintenance
 * @param email - The email of the user
 */
app.post('/api/add-maintenance-history', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const garage = DATABASE.collection("user_vehicle_info");
            const configId = req.query.configId;
            const maintenance = {
                type: req.body.type,
                date: req.body.date,
                maintenance: req.body.maintenance,
                cost: parseInt(req.body.cost)
            };
            const add = await garage.updateOne(
                { email: decoded.email, config_id: parseInt(configId) },
                { $push: { completed_maintenance: maintenance } }
            );
            return res.json(add.modifiedCount);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

/***
 * This route is used to update maintenance history in the DATABASE
 * @param configId - The config_id of the vehicle
 * @param old_type - The old type of maintenance
 * @param old_date - The old date of the maintenance
 * @param old_maintenance - The old maintenance performed
 * @param old_cost - The old cost of the maintenance
 * @param new_type - The new type of maintenance
 * @param new_date - The new date of the maintenance
 * @param new_maintenance - The new maintenance performed
 * @param new_cost - The new cost of the maintenance
 * @param email - The email of the user
 */
app.post('/api/update-maintenance-history', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const garage = DATABASE.collection("user_vehicle_info");
            const {
                old_type, old_date, old_maintenance, old_cost,
                new_type, new_date, new_maintenance, new_cost
            } = req.body;
            const update = await garage.updateOne(
                {
                    email: decoded.email,
                    config_id: parseInt(req.query.configId),
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
                });
            return res.json(update.modifiedCount);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

app.delete('/api/delete-maintenance-history', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const garage = DATABASE.collection("user_vehicle_info");

            const { type, date, maintenance, cost } = req.body;
            const deletion = await garage.updateOne(
                {
                    email: decoded.email,
                    config_id: parseInt(req.query.configId)
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
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

/***
 * This route is used to get the user's vehicles from the DATABASE
 */
app.get('/api/get-user-vehicles', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{
        const token = authorization.split(" ")[1];

        console.log("GET-USER-VEHICLES \n"+token);
        console.log('DECODED ' + jwt.decode(token, JWTSecret) + "\n");

        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const garage = DATABASE.collection("user_garage");
            const vehicles = await garage.aggregate([
                {
                    $match: {
                        email: decoded.email
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
                        configurations: 1,
                    }
                }
            ]).toArray();
            res.send(vehicles);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});
app.delete('/api/delete-user-vehicle', async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const garage = DATABASE.collection("user_garage");
            const vehicInfo = DATABASE.collection("user_vehicle_info");

            const { config_id } = req.body;
            const deletion = await garage.updateOne(
                {email: decoded.email},
                {$pull: { vehicle_config_ids: config_id } }
            );
            const deletionTwo = await vehicInfo.deleteOne(
                {email: decoded.email, config_id: config_id}
            );
            return res.json(deletion.modifiedCount+deletionTwo.deletedCount);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/get-maintenance', async (req, res) => {
    const message = DATABASE.collection("maintenance");
    const config_id = req.query.config_id;
    const odometer = req.query.odometer;
    let maintenance = null;

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json({ message: "Authorization Needed!" });
    }
    try {
        const token = authorization.split(" ")[1];
        //console.log(token + ": TOKEN");
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if (err) {
                //console.log("TOKEN NOT WORK HERE");
                return res.status(401).json({ message: "Invalid Token" });
            }
            //console.log("TOKEN PASS GOOD");
            const docObject = await message.findOne({ config_id });

            //console.log("DOC OBJECT " + JSON.stringify(docObject));

            //console.log("DOC OBJECT BEFORE" + JSON.stringify(docObject));

            if (docObject) {
                //  console.log("DOC OBJECT Sched: " + docObject.schedules);
                //console.log("DOC OBJECT " + JSON.stringify(docObject));
                for (const schedule of docObject.schedules) {
                    //console.log("MADE IT IN");
                    const mileage = parseInt(schedule.service_schedule_mileage.replace(',', ''));
                    if (mileage > odometer) {
                        //console.log("MILEAGE: " + mileage);
                        maintenance = schedule;
                        //console.log("MAINTENANCE: " + maintenance);
                        break;
                    }
                }
                if (maintenance) {
                    res.send(maintenance);
                } else {
                    res.status(404).json({ message: "No maintenance found for this vehicle" });
                }
            } else {
                res.status(404).json({ message: "No maintenance scheduled for this vehicle" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error Validating User" });
    }
});


app.get('/api/get-config-id', async (req, res) => {
    const year = req.query.year;
    const make = req.query.make;
    const model = req.query.model;
    const engine = req.query.engine;
    const transmission = req.query.transmission;

    if(!year || !make || !model || !engine || !transmission) {
        return res.status(400).json({message: "Missing required fields"});
    }
    else{
        const { authorization } = req.headers;
        //console.log("USER AUTHORIZ: "+authorization)
        if(!authorization) {
            res.status(400).json({message: "Authorization Needed!"});
        }
        try{

            const token = authorization.split(" ")[1];
            //console.log(token+ ": TOKEN");
            jwt.verify(token, JWTSecret, async (err, decoded) => {
                if(err) {
                    res.status(401).json({message: "Invalid Token"});
                }
                const message = DATABASE.collection("configurations");

                const config_id = await message.findOne({year: parseInt(year), make: make, model: model, engine: engine, transmission: transmission});

                res.send(config_id);

            });
        }
        catch(err) {
            res.status(500).json({message: "Error Validating User"});
        }

    }
})

app.get('/api/get-years', async (req, res) => {
    const { authorization } = req.headers;
    //console.log("USER AUTHORIZ: "+authorization)
    if(!authorization) {
        res.status(400).json({message: "Authorization Needed!"});
    }
    try{

        const token = authorization.split(" ")[1];
        //console.log(token+ ": TOKEN");
        jwt.verify(token, JWTSecret, async (err, decoded) => {
            if(err) {
                res.status(401).json({message: "Invalid Token"});
            }
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");
            const years = await configurations.aggregate([
                { $group: { _id: "$year", years: { $addToSet: "$year" } }},
                { $sort: { _id: 1 }}
            ]).toArray();
            res.send(years);
        });
    }
    catch(err) {
        res.status(500).json({message: "Error Validating User"});
    }
});

app.get('/api/get-makes', async (req, res) => {
    const carYear = req.query.year;

    if(!carYear) {
        return res.status(400).json({message: "Missing required fields"});
    }
    else{
        const { authorization } = req.headers;
        //console.log("USER AUTHORIZ: "+authorization)
        if(!authorization) {
            res.status(400).json({message: "Authorization Needed!"});
        }
        try{

            const token = authorization.split(" ")[1];
            //console.log(token+ ": TOKEN");
            jwt.verify(token, JWTSecret, async (err, decoded) => {
                if(err) {
                    res.status(401).json({message: "Invalid Token"});
                }
                const database = client.db("vehicleDB");
                const configurations = database.collection("configurations");

                const makes = await configurations.aggregate([
                    { $match: { year: parseInt(carYear) }},
                    { $group: { _id: "$make", makes: { $addToSet: "$make" } }},
                    { $sort: { _id: 1 }}
                ]).toArray();

                const uniqueMakes = makes.map(make => make._id);

                res.send(uniqueMakes);
            })}
        catch(err) {
            res.status(500).json({message: "Error Validating User"});

        }
    }});

app.get('/api/get-models', async (req, res) => {
    const year = req.query.year;
    const make = req.query.make;

    if(!year || !make) {
        return res.status(400).json({message: "Missing required fields"});
    }
    else{
        const { authorization } = req.headers;
        //console.log("USER AUTHORIZ: "+authorization)
        if(!authorization) {
            res.status(400).json({message: "Authorization Needed!"});
        }
        try{

            const token = authorization.split(" ")[1];
            //console.log(token+ ": TOKEN");
            jwt.verify(token, JWTSecret, async (err, decoded) => {
                if(err) {
                    res.status(401).json({message: "Invalid Token"});
                }
                const database = client.db("vehicleDB");
                const configurations = database.collection("configurations");
                const models = await configurations.aggregate([
                    { $match: { year: parseInt(year), make: make }},
                    { $group: { _id: "$model", models: { $addToSet: "$model" } }},
                    { $sort: { _id: 1 }}
                ]).toArray();

                const uniqueModels = models.map(model => model._id);
                res.send(uniqueModels);
            })}
        catch(err) {
            res.status(500).json({message: "Error Validating User"});
        }}

})

app.get('/api/get-engines', async (req, res) => {
    const year = req.query.year;
    const make = req.query.make;
    const model = req.query.model;

    if(!year || !make || !model) {
        return res.status(400).json({message: "Missing required fields"});
    }
    else{
        const { authorization } = req.headers;
        //console.log("USER AUTHORIZ: "+authorization)
        if(!authorization) {
            res.status(400).json({message: "Authorization Needed!"});
        }
        try{

            const token = authorization.split(" ")[1];
            //console.log(token+ ": TOKEN");
            jwt.verify(token, JWTSecret, async (err, decoded) => {
                if(err) {
                    res.status(401).json({message: "Invalid Token"});
                }
                const database = client.db("vehicleDB");
                const configurations = database.collection("configurations");
                const engines = await configurations.aggregate([
                    { $match: { year: parseInt(year), make: make, model: model }},
                    { $group: { _id: "$engine", engines: { $addToSet: "$engine" } }},
                    { $sort: { _id: 1 }}
                ]).toArray();

                const uniqueEngines = engines.map(engine => engine._id);
                res.send(uniqueEngines);
            })}
        catch(err) {
            res.status(500).json({message: "Error Validating User"});
        }
    }
})

app.get('/api/get-transmissions', async (req, res) => {
    const year = req.query.year;
    const make = req.query.make;
    const model = req.query.model;
    const engine = req.query.engine;

    if(!year || !make || !model || !engine) {
        return res.status(400).json({message: "Missing required fields"});
    }    else{
        const { authorization } = req.headers;
        //console.log("USER AUTHORIZ: "+authorization)
        if(!authorization) {
            res.status(400).json({message: "Authorization Needed!"});
        }
        try{

            const token = authorization.split(" ")[1];
            //console.log(token+ ": TOKEN");
            jwt.verify(token, JWTSecret, async (err, decoded) => {
                if(err) {
                    res.status(401).json({message: "Invalid Token"});
                }
                const database = client.db("vehicleDB");
                const configurations = database.collection("configurations");
                const transmissions = await configurations.aggregate([
                    { $match: { year: parseInt(year), make: make, model: model, engine: engine }},
                    { $group: { _id: "$transmission", transmissions: { $addToSet: "$transmission" } }},
                    { $sort: { _id: 1 }}
                ]).toArray();

                const uniqueTransmissions = transmissions.map(transmission => transmission._id);
                res.send(uniqueTransmissions);
            })}
        catch(err) {
            res.status(500).json({message: "Error Validating User"});
        }
    }
});

app.post('/api/add-vehicle', async (req, res) => {
    const config_id = req.body.config_id;

    const { authorization } = req.headers;
    //console.log(authorization);

    if( !authorization ) {
        res.status(400).json({message: "Authorization needed"})
    }
    try {
        const token = authorization.split(' ')[1];
        //console.log(token);
        //ok so have a token and we want to verify it
        jwt.verify( token, JWTSecret, async(err, decoded) => {
            if(err) {
                return res.status(400).json({message: 'Unable to verify token'});
            }

            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            const userVehicle = database.collection("user_vehicle_info");

            try{
                const exist = await garage.findOne({email: decoded.email});
                if(exist) {
                    await garage.updateOne(
                        { email: decoded.email },
                        { $addToSet: { vehicle_config_ids: config_id } }
                    );
                    await userVehicle.insertOne(
                        { email: decoded.email, config_id: config_id, odometer: 0, upcoming_maintenance: [], completed_maintenance: [] })
                    return res.status(200).json({message: "Vehicle added to garage"});
                }
                else {
                    await garage.insertOne(
                        { email: decoded.email, vehicle_config_ids: [config_id] }
                    )
                    await userVehicle.insertOne(
                        { email: decoded.email, config_id: config_id, odometer: 0, upcoming_maintenance: [], completed_maintenance: [] })
                    return res.status(200).json({message: "User Vehicle added to info"});
                }
            }
            catch(err) {
                return res.status(500).json(err);
            }
        });
    }
    catch(err) {
        return res.status(500).json({message: "Error Validating User"});
    }
});

app.post('/api/update-odometer', async (req, res) => {
    const odometer = req.body.odometer;
    const config_id = req.body.config_id;
    const picture_url = req.body.picture_url;

    const { authorization } = req.headers;
    //console.log(authorization);

    if( !authorization ) {
        res.status(400).json({message: "Authorization needed"})
    }
    try {
        const token = authorization.split(' ')[1];
        //console.log(token);
        //ok so have a token and we want to verify it
        jwt.verify( token, JWTSecret, async(err, decoded) => {
            if(err) {
                return res.status(400).json({message: 'Unable to verify token'});
            }
            const database = client.db("vehicleDB");
            const userVehicle = database.collection("user_vehicle_info");

            try{
                const updateFields = { email: decoded.email, config_id: config_id};
                const updateData = {};

                if(odometer !== undefined) {
                    updateData.odometer = parseInt(odometer);
                }
                if(picture_url !== undefined) {
                    updateData.picture_url = picture_url;
                }

                await userVehicle.updateOne(
                    updateFields,
                    { $set: updateData }
                );
                return res.status(200).json({message: "Odometer updated"});
            }
            catch(err) {
                return res.status(500).json(err);
            }
        });
    }
    catch(err) {
        return res.status(500).json({message: "Error Validating User"});
    }
});

app.get('/api/get-user-vehicle-odometers', async (req, res) => {
    const { authorization } = req.headers;
    //console.log(authorization);

    if( !authorization ) {
        res.status(400).json({message: "Authorization needed"})
    }
    try {
        const token = authorization.split(' ')[1];
        //console.log(token);
        //ok so have a token and we want to verify it
        jwt.verify( token, JWTSecret, async(err, decoded) => {
            if(err) {
                return res.status(400).json({message: 'Unable to verify token'});
            }
            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            const userVehicle = database.collection("user_vehicle_info");
            const userGarage = await garage.findOne({email: decoded.email});

            if(!userGarage){
                return res.status(404).json({message: "User not found"});
            }

            const vehicleConfigIds = userGarage.vehicle_config_ids;
            if(!vehicleConfigIds){
                return res.status(404).json({message: "User has no vehicles"});
            }

            const vehicle = await userVehicle.find(
                {email: decoded.email, config_id: {$in: vehicleConfigIds}}
            ).toArray();

            res.status(200).json(vehicle);

        });
    }
    catch(err) {
        return res.status(500).json({message: "Error Validating User"});
    }
});


app.listen(port, () => {
    console.log(`Driveline app listening on port ${port}`)
    //console.log(mongo);
});