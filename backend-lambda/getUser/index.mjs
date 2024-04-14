import {MongoClient, ServerApiVersion} from 'mongodb';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const authorization  = event.headers['Authorization'];

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
            const users = database.collection("users");
            return await users.findOne({email: decoded.email});
        }).then(user => {
            return {
                statusCode: 200,
                body: JSON.stringify(user)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" })
            };
        }).finally(() => client.close());
};
