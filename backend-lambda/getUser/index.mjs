import { MongoClient, ServerApiVersion } from 'mongodb';
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

    console.log(process.env.JWTSecret)

    const authorization = event.headers['Authorization'];
    if (!authorization) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "No token provided" })
        };
    }

    try {
        const token = authorization.split(" ")[1];
        console.log("Token:", token);

        const decoded = jwt.verify(token, process.env.JWTSecret);
        console.log("Decoded:", decoded);

        await client.connect();

        const database = client.db("vehicleDB");
        const users = database.collection("users");
        const user = await users.findOne({ email: decoded.email });
        console.log("User:", user);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(user)
            };
        }
    } catch (err) {
        console.error("JWT Verification Error:", err);
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Unauthorized" })
        };
    } finally {
        await client.close();
    }
};
