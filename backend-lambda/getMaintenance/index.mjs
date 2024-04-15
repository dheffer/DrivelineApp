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
    const config_id = event['queryStringParameters'].config_id;
    const odometer = event['queryStringParameters'].odometer;

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

            const database = client.db("vehicleDB");
            const collection = database.collection("maintenance");
            return await collection.findOne({config_id: config_id});
        }).then(res => {
            if (res && res.schedules) {
                for (const schedule of res.schedules) {
                    const mileage = parseInt(schedule.service_schedule_mileage.replace(',', ''));

                    if (mileage > odometer) {
                        return schedule;
                    }
                }
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