import {MongoClient, ServerApiVersion} from 'mongodb';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    console.log(event);
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const authorization  = event.headers['Authorization'];

    const year = event.year;
    const make = event.make;
    const model = event.model;
    const engine = event.engine;
    const transmission = event.transmission;

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            console.log("Token:", token);
            const decoded = jwt.verify(token, process.env.JWTSecret);
            if (!decoded) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "No token provided" })
                };
            }
            const database = client.db("vehicleDB");
            const config = database.collection("configurations");
            return await config.findOne({
                year: parseInt(year),
                make: make,
                model: model,
                engine: engine,
                transmission: transmission
            });
        }).then(config => {
            return {
                statusCode: 200,
                body: JSON.stringify(config)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" })
            };
        }).finally(() => client.close());
};
