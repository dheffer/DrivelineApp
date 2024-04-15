import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const authorization = event.headers['Authorization'];
    const config_id = event['queryStringParameters'].config_id;
    const data = JSON.parse(event.body);

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
            console.log(decoded.email)
            const database = client.db("vehicleDB");
            const garage = database.collection("user_vehicle_info");
            return await garage.updateOne(
                {
                    email: decoded.email,
                    config_id: parseInt(config_id)
                },
                {$pull:
                        {
                            completed_maintenance: {
                                type: data.type,
                                date: data.date,
                                maintenance: data.maintenance,
                                cost: parseInt(data.cost)
                            }
                        }
                }
            );
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