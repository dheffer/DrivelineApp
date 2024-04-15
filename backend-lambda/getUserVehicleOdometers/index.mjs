import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
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
};