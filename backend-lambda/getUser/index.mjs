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
        }
    );
    const authorization = event.headers['authorization'];
    console.log(authorization);

    try {
        await client.connect();

        if (authorization) {
            const token = authorization.split(' ')[1];
            console.log(`token --- ${token}`);
            try {
                const decoded = jwt.verify(token, process.env.JWTSecret);
                const database = client.db('vehicleDB');
                const users = database.collection('users');
                const user = await users.findOne({ email: decoded.email });
                console.log(user);
                if (user) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(user)
                    };
                } else {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ message: 'User not found' })
                    };
                }
            } catch (err) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Unauthorized' })
                };
            }
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
        };
    } finally {
        await client.close();
    }
};
