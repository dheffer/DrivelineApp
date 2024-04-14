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
    const engine = event['engine'];

    return client.connect()
        .then(async () => {
            const database = client.db("vehicleDB");
            const configurations = database.collection("configurations");
            const transmissions = await configurations.aggregate([
                { $match: { year: parseInt(year), make: make, model: model, engine: engine }},
                { $group: { _id: "$transmission", transmissions: { $addToSet: "$transmission" } }},
                { $sort: { _id: 1 }}
            ]).toArray();
            return transmissions.map(transmission => transmission._id);
        }).then(transmissions => {
            return {
                statusCode: 200,
                body: JSON.stringify(transmissions)
            };
        }).catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Internal Server Error: ${err.message}` })
            };
        }).finally(() => client.close());
};