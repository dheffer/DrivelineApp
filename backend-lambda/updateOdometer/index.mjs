
import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken'

export const handler = async (event, context) => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
    );

    const authorization = event.headers['Authorization'];
    const config_id = event.config_id;
    const odometer = event.odometer;
    const picture_url = event.picture_url;

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({message: "Token invalid"})
                };
            }
            const decoded = jwt.decode(token, process.env.JWTSecret);
            console.log("Decoded:", decoded);
            console.log("name & email: " + decoded.name + " " + decoded.email);

            const database = client.db("vehicleDB");
            const userVehicle = database.collection("user_vehicle_info");
            const updateData = {};
            let type = '';
            if (odometer) {
                type = 'Odometer';
                await userVehicle.updateOne(
                    { email: decoded.email, config_id: config_id },
                    { $set: { odometer: parseInt(odometer) } }
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(`${type} updated to ${odometer}`)
                };
            }
            else if (picture_url) {
                updateData.picture_url = picture_url;
                type = 'Picture URL'
                await userVehicle.updateOne(
                    { email: decoded.email, config_id: config_id },
                    { $set: { picture_url: picture_url } }
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(`${type} updated to ${picture_url}`)
                };
            }
            else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Bad Request: Please provide odometer or picture_url" })
                };
            }
        }).finally(() => client.close());
};