import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';

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
    const year = event['year'];
    const make = event['make'];
    const model = event['model'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");
            const engines = await configurations.aggregate([
                { $match: { year: parseInt(year), make: make, model: model }},
                { $group: { _id: "$engine", engines: { $addToSet: "$engine" } }},
                { $sort: { _id: 1 }}
            ]).toArray();
            return engines.map(engine => engine._id);
        }).then(engines => {
            return {
                statusCode: 200,
                body: JSON.stringify(engines)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};