import {MongoClient, ServerApiVersion} from "mongodb";
import 'dotenv/config'
import jwt from 'jsonwebtoken';

export const handler = async (event) => {

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

    return client.connect()
        .then(async () => {
            const token = authorization.split(" ")[1];
            console.log("Token:", token);
            const verified = jwt.verify(token, process.env.JWTSecret);
            if (!verified) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "No token provided" })
                };
            }
            const decoded = jwt.decode(token, process.env.JWTSecret);
            console.log("Decoded:", decoded);
            console.log("name & email: " + decoded.name + " " + decoded.email);

            const database = client.db("vehicleDB");
            const garage = database.collection("user_garage");
            return await garage.aggregate([
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
                        configurations: 1
                    }
                }
            ]).toArray();
        }).then(vehicles => {
            return {
                statusCode: 200,
                body: JSON.stringify(vehicles)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
}