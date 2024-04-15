import {MongoClient, ServerApiVersion} from "mongodb";
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
    const authorization = event.headers['Authorization'];
    const config_id = event['queryStringParameters'].config_id;
    console.log(event);
    console.log("config_id " + config_id);

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Token invalid" })
                };
            }
            else {
                const database = client.db("vehicleDB");
                const vehicle = database.collection("configurations")
                return await vehicle.findOne({config_id: parseInt(config_id)});
            }
        }).then(config => {
            return {
                statusCode: 200,
                body: JSON.stringify({message: config})
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};