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
    const carYear = event['queryStringParameters'].year;


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
            const configurations = database.collection("configurations");
            const makes = await configurations.aggregate([
                {$match: {year: parseInt(carYear)}},
                {$group: {_id: "$make", makes: {$addToSet: "$make"}}},
                {$sort: {_id: 1}}
            ]).toArray();
            return makes.map(make => make._id);
        }).then(makes => {
            return {
                statusCode: 200,
                body: JSON.stringify(makes)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" })
            };
        }).finally(() => client.close());
};
