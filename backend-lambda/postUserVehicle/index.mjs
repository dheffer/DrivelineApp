import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

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
    console.log(event);
    const authorization = event.headers['Authorization'];
    const data = JSON.parse(event.body);
    const config_id = data.config_id;

    return client.connect()
        .then(async () => {
            console.log(authorization.split(" ")[1]);
            const token = authorization.split(" ")[1];
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({message: "Token invalid"})
                };
            }
            const decoded = jwt.decode(token, process.env.JWTSecret);

            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            const userVehicle = database.collection("user_vehicle_info");

            const exist = await garage.findOne({email: decoded.email});
            console.log("EXIST " + exist);
            if (exist) {
                await garage.updateOne(
                    {email: decoded.email},
                    {$addToSet: {vehicle_config_ids: config_id}}
                );
                await userVehicle.insertOne(
                    {email: decoded.email, config_id: config_id, odometer: 0, completed_maintenance: []})
            } else {
                await garage.insertOne(
                    {email: decoded.email, vehicle_config_ids: [config_id]}
                )
                await userVehicle.insertOne(
                    {email: decoded.email, config_id: config_id, odometer: 0, completed_maintenance: []})
            }
        }).then(res => {
            return {
                statusCode: 200,
                body: JSON.stringify({message: res})
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};